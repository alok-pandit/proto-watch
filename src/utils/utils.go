package utils

import (
	"fmt"
	"go/ast"
	"log"
	"os"
	"os/exec"
	"reflect"
	"regexp"
	"strings"
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

func ExecProtoGen(fnwos, outDir, gen string) {
	protoFileName := outDir + "/" + fnwos + ".proto"
	tsFileName := gen + "/" + fnwos + ".pb.ts"

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
		for range field.Names {
			fmt.Fprintf(file, "    %s %s = %d;\n", fieldType, getJsonTag(field), i+1)
		}
	}
	fmt.Fprintf(file, "}\n\n")
}

func WriteProtoServiceContent(file *os.File, name string, serviceMap map[string]int) {
	f := strings.Split(file.Name(), "/")
	fName := strings.ReplaceAll(f[len(f)-1], ".proto", "")
	fmt.Fprintf(file, "service %sService {\n", fName)

	for name := range serviceMap {
		fmt.Fprintf(file, "  rpc %s(%sRequest) returns (%sResponse);\n", name, name, name)
	}

	fmt.Fprintf(file, "}\n")
}

func RegexMatcher(requestRegex *regexp.Regexp, responseRegex *regexp.Regexp, structName string, serviceMap map[string]int) string {
	var name string
	if matchedReq := requestRegex.MatchString(structName); matchedReq {
		name = strings.Replace(structName, "Request", "", 1)
		serviceMap[name]++
	}
	if matchedRes := responseRegex.MatchString(structName); matchedRes {
		name = strings.Replace(structName, "Response", "", 1)
		serviceMap[name]++
	}
	return name
}

func getJsonTag(field *ast.Field) string {
	if field.Tag != nil {
		tagValue := reflect.StructTag(strings.Trim(field.Tag.Value, "`")).Get("json")
		if tagValue != "" && tagValue != "-" { // Ensure it's not omitted with "-"
			return strings.Split(tagValue, ",")[0]
		}
	}
	// Fallback to the field name if no JSON tag is present
	if len(field.Names) > 0 {
		return field.Names[0].Name
	}
	return ""
}
