package utils

import (
	"fmt"
	"go/ast"
	"log"
	"os"
	"os/exec"
)

func GetProtoType(expr ast.Expr, structs map[string]*ast.StructType) string {
	switch t := expr.(type) {
	case *ast.Ident:
		if _, ok := structs[t.Name]; ok {
			return t.Name // Nested struct
		}
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
		elemType := GetProtoType(t.Elt, structs)
		return "repeated " + elemType
	case *ast.StructType:
		return "string"
	}
	return "string"
}

func ExecProtoGen(fnwos, outDir string) {
	protoFileName := outDir + "/" + fnwos + ".proto"
	tsFileName := "gen" + "/" + fnwos + ".pb.ts"

	outd := "--go_out=."

	// cmd2 := exec.Command("protoc", outd, "--go_opt=paths=source_relative", protoFileName)
	cmd2 := exec.Command("protoc", outd, protoFileName)

	out2, err2 := cmd2.CombinedOutput()
	if err2 != nil {
		log.Printf("Error generating Go for %s: %s\n", fnwos, err2)
		log.Println("Output:", string(out2))
	} else {
		log.Printf("Successfully generated Go for %s: %s\n", fnwos, string(out2))
	}

	cmd := exec.Command("npx", "pbjs", protoFileName, "--ts", tsFileName)

	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("Error generating TS for %s: %s\n", fnwos, err)
		log.Println("Output:", string(out))
		return
	} else {
		log.Printf("Successfully generated TS for %s: %s\n", fnwos, string(out))
	}

}

func WriteProtoMessageContent(file *os.File, structName string, structType *ast.StructType, structs map[string]*ast.StructType) {
	fmt.Fprintf(file, "message %s {\n", structName)
	for i, field := range structType.Fields.List {
		fieldType := GetProtoType(field.Type, structs)
		for _, name := range field.Names {
			fmt.Fprintf(file, "    %s %s = %d;\n", fieldType, name.Name, i+1)
		}
	}
	fmt.Fprintf(file, "}\n\n")
}
