package initiator

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

type Config struct {
	WatchFolder string `mapstructure:"watch-folder"`
	OutFolder   string `mapstructure:"out-folder"`
}

type model struct {
	folder string
	status string
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		}
	}
	return m, nil
}

func (m model) View() string {
	style := lipgloss.NewStyle().Padding(1, 2, 1, 2)
	return style.Render(fmt.Sprintf("Monitoring folder: %s\nStatus: %s\n\nPress q to quit.", m.folder, m.status))
}

func Initiate() {
	viper.SetConfigName("proto-watch")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		log.Fatalf("Unable to decode into struct: %v", err)
	}

	if _, err := os.Stat(config.WatchFolder); os.IsNotExist(err) {
		log.Println("Folder does not exist:", config.WatchFolder)
		os.Exit(1)
	}

	if _, err := os.Stat(config.OutFolder); os.IsNotExist(err) {
		log.Println("Folder does not exist:", config.OutFolder, "!Creating")
		if err := os.Mkdir(config.OutFolder, 0777); err != nil {
			log.Println("Error creating:", config.OutFolder, err.Error())
		}
	}

	m := model{folder: config.WatchFolder, status: "Watching for changes..."}
	p := tea.NewProgram(m)

	go watchFolder(config.OutFolder, config.WatchFolder, &m)

	_, err := p.Run()

	if err != nil {
		log.Fatalf("Failed to start Bubble Tea program: %v", err)
	}
}

func watchFolder(out string, folder string, m *model) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	var mu sync.Mutex

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}

				if event.Op&fsnotify.Create == fsnotify.Create || event.Op&fsnotify.Write == fsnotify.Write {
					mu.Lock()
					m.status = fmt.Sprintf("File changed: %s", event.Name)
					mu.Unlock()

					if strings.HasSuffix(event.Name, ".go") {
						go processFile(out, event.Name)
					}
				}

			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	err = watcher.Add(folder)
	if err != nil {
		log.Fatal(err)
	}

	// Initial processing of existing files in the folder
	files, err := os.ReadDir(folder)
	if err != nil {
		log.Fatal(err)
	}
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".go") {
			go processFile(out, filepath.Join(folder, file.Name()))
		}
	}

	<-make(chan struct{})
}

func processFile(outDir string, path string) {
	src, err := os.ReadFile(path)
	if err != nil {
		log.Printf("Failed to read file: %s\n", path)
		return
	}

	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, path, src, 0)
	if err != nil {
		log.Printf("Failed to parse file: %s\n", path)
		return
	}

	for _, decl := range f.Decls {
		if genDecl, ok := decl.(*ast.GenDecl); ok {
			for _, spec := range genDecl.Specs {
				if typeSpec, ok := spec.(*ast.TypeSpec); ok {
					if structType, ok := typeSpec.Type.(*ast.StructType); ok {
						go convertToProto(outDir, path, typeSpec.Name.Name, structType)
					}
				}
			}
		}
	}
}

func convertToProto(out string, path, structName string, structType *ast.StructType) {
	protoFileName := strings.TrimSuffix(filepath.Base(path), ".go") + ".proto"
	file, err := os.Create(out + "/" + protoFileName)
	if err != nil {
		log.Printf("Failed to create proto file: %s\n", protoFileName)
		return
	}
	defer file.Close()

	fmt.Fprintf(file, "syntax = \"proto3\";\n\n")
	fmt.Fprintf(file, "package main;\n\n")
	fmt.Fprintf(file, "import \"google/protobuf/timestamp.proto\";\n\n")
	fmt.Fprintf(file, "message %s {\n", structName)

	for i, field := range structType.Fields.List {
		fieldType := getProtoType(field.Type)
		for _, name := range field.Names {
			fmt.Fprintf(file, "    %s %s = %d;\n", fieldType, name.Name, i+1)
		}
	}

	fmt.Fprintf(file, "}\n")
}

func getProtoType(expr ast.Expr) string {
	switch t := expr.(type) {
	case *ast.Ident:
		switch t.Name {
		case "int", "int32":
			return "int32"
		case "int64":
			return "int64"
		case "uint", "uint32":
			return "uint32"
		case "uint64":
			return "uint64"
		case "float32":
			return "float"
		case "float64":
			return "double"
		case "string":
			return "string"
		case "bool":
			return "bool"
		default:
			return "string"
		}
	case *ast.SelectorExpr:
		if t.Sel.Name == "Time" {
			if pkgIdent, ok := t.X.(*ast.Ident); ok && pkgIdent.Name == "time" {
				return "google.protobuf.Timestamp"
			}
		}
	case *ast.ArrayType:
		if eltType, ok := t.Elt.(*ast.Ident); ok {
			switch eltType.Name {
			case "int32":
				return "repeated int32"
			case "int64":
				return "repeated int64"
			case "uint32":
				return "repeated uint32"
			case "uint64":
				return "repeated uint64"
			case "float32":
				return "repeated float"
			case "float64":
				return "repeated double"
			case "string":
				return "repeated string"
			case "bool":
				return "repeated bool"
			default:
				return "repeated string"
			}
		}
	}
	return "string"
}
