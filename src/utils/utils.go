package utils

import "go/ast"

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
