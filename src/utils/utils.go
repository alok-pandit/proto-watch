package utils

import "go/ast"

func GetProtoType(expr ast.Expr) string {
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
