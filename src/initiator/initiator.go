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

	"github.com/alok-pandit/proto-watch/src/utils"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

type Config struct {
	WatchFolder string `mapstructure:"watch-folder"`
	OutFolder   string `mapstructure:"out-folder"`
}

type genInputs struct {
	path   string
	outDir string
}

var genChan = make(chan genInputs, 1)

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

		case "g":

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
	go listenGenChan()
	defer close(genChan)

	_, err := p.Run()

	if err != nil {
		log.Fatalf("Failed to start Bubble Tea program: %v", err)
	}

}

func watchFolder(outDir string, folder string, m *model) {
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

					if strings.HasSuffix(event.Name, ".go") && !strings.Contains(event.Name, ".pb.go") {
						go processFile(outDir, event.Name)
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
		log.Println("NAME", file.Name())
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".go") && !strings.Contains(file.Name(), ".pb.go") {
			go processFile(outDir, filepath.Join(folder, file.Name()))
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
		log.Println("Failed to parse file:", path, err.Error())
		return
	}

	structs := make(map[string]*ast.StructType)

	for _, decl := range f.Decls {
		if genDecl, ok := decl.(*ast.GenDecl); ok {
			for _, spec := range genDecl.Specs {
				if typeSpec, ok := spec.(*ast.TypeSpec); ok {
					if structType, ok := typeSpec.Type.(*ast.StructType); ok {
						structs[typeSpec.Name.Name] = structType
					}
				}
			}
		}
	}

	if len(structs) > 0 {
		go convertToProto(outDir, path, structs)
	}

}

func convertToProto(outDir string, path string, structs map[string]*ast.StructType) {
	fn := strings.TrimSuffix(filepath.Base(path), ".go")
	protoFileName := fn + ".proto"

	file, err := os.Create(outDir + "/" + protoFileName)
	if err != nil {
		log.Printf("Failed to create proto file: %s %s\n", protoFileName, err.Error())
		return
	}

	defer file.Close()

	fmt.Fprintf(file, "syntax = \"proto3\";\n\n")
	fmt.Fprintf(file, "package proto;\n\n")
	// TODO: Get go_package from yaml file
	fmt.Fprintf(file, "option go_package = \"./gen;gen\";\n\n")
	fmt.Fprintf(file, "import \"google/protobuf/timestamp.proto\";\n\n")

	for structName, structType := range structs {
		utils.WriteProtoMessageContent(file, structName, structType, structs)
	}

	genChan <- genInputs{path: fn, outDir: outDir}

}

func listenGenChan() {
	for input := range genChan {
		fmt.Printf("Proto file created: %s\nOutput directory: %s\n", input.path, input.outDir)
		go utils.ExecProtoGen(input.path, input.outDir)
	}
}
