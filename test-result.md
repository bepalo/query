# Test Report

| 🕙 Start time | ⌛ Duration |
| --- | ---: |
| 6/2/2026, 5:12:35 PM | 0.787 s |

| | ✅ Passed | ❌ Failed | ⏩ Skipped | 🚧 Todo | ⚪ Total |
| --- | ---: | ---: | ---: | ---: | ---: |
|Test Suites|37|0|0|0|37|
|Tests|170|0|0|0|170|

## ✅ <a id="file0" href="#file0">tests/parser.test.js</a>

170 passed, 0 failed, 0 skipped, 0 todo, done in 56.796411000000035 s

```
✅ RJSON.parse - Objects
   ✅ should parse simple object
   ✅ should parse object with multiple properties
   ✅ should parse nested objects
   ✅ should parse object with numeric keys
   ✅ should parse object with dot notation keys
   ✅ should parse object with quoted keys
   ✅ should parse empty object
   ✅ should parse object with empty value (null)
✅ RJSON.parse - Arrays
   ✅ should parse simple array
   ✅ should parse array with strings
   ✅ should parse array with mixed types
   ✅ should parse array with booleans
   ✅ should parse nested arrays
✅ RJSON.parse - Strings
   ✅ should parse single quoted string
   ✅ should parse double quoted string
   ✅ should parse backtick quoted string
   ✅ should parse string with escaped quotes
✅ RJSON.parse - Numbers
   ✅ should parse integer
   ✅ should parse negative number
   ✅ should parse positive number with plus sign
   ✅ should parse decimal number
   ✅ should parse scientific notation lowercase e
   ✅ should parse scientific notation uppercase E
   ✅ should parse negative exponent
   ✅ should parse zero
✅ RJSON.parse - Booleans
   ✅ should parse true as T
   ✅ should parse false as F
✅ RJSON.parse - Null and Undefined
   ✅ should parse explicit null as N
   ✅ should parse undefined as U
   ✅ should parse empty value as null
✅ RJSON.parse - Mapped Arrays
   ✅ should parse mapped array with true
   ✅ should parse mapped array with false
   ✅ should parse mapped array with number
   ✅ should parse mapped array with 1
✅ RJSON.parse - Complex Examples
   ✅ should parse complex nested structure
✅ RJSON.stringify - Basic Types
   ✅ should stringify string
   ✅ should stringify number
   ✅ should stringify true
   ✅ should stringify false
   ✅ should stringify null
   ✅ should stringify undefined
✅ RJSON.stringify - Objects
   ✅ should stringify simple object
   ✅ should stringify object with multiple properties
   ✅ should stringify nested objects
✅ RJSON.stringify - Arrays
   ✅ should stringify simple array
   ✅ should stringify array with strings
   ✅ should stringify array with mixed types
   ✅ should stringify nested arrays
✅ RJSON.stringify - Strings with quotes
   ✅ should stringify string with single quotes using double quotes
   ✅ should stringify string with double quotes using single quotes
   ✅ should stringify string with backticks using single quotes
✅ RJSON.stringify - Numbers
   ✅ should stringify small numbers as standard notation
   ✅ should stringify large numbers in shortest form
   ✅ should stringify very small numbers in scientific notation
   ✅ should stringify zero
✅ RJSON.stringifyMappedArray
   ✅ should stringify mapped array with true
   ✅ should stringify mapped array with false
   ✅ should stringify mapped array with number
✅ RJSON.parse - Stringify roundtrip
   ✅ should roundtrip simple object
   ✅ should roundtrip array
   ✅ should roundtrip complex structure
✅ RJSON.rjson - Tagged template
   ✅ should parse with tagged template
✅ RJSON API object
   ✅ RJSON.parse should work like parseRJSON
   ✅ RJSON.stringify should work like stringifyRJSON
   ✅ RJSON.stringifyMappedArray should work like stringifyRJSONMappedArray
✅ Error handling
   ✅ should throw on invalid object key
   ✅ should throw on invalid array syntax
   ✅ should throw on extra tokens at end
   ✅ should throw on unmatched parentheses
   ✅ should throw on invalid mapped array
✅ Edge cases
   ✅ should parse empty string value
   ✅ should parse array with null values
   ✅ should handle object with many properties
   ✅ should parse very nested structure
   ✅ should stringify and parse object with special identifier keys
✅ RJSON.parse - Whitespace handling
   ✅ should parse object with no whitespace
   ✅ should parse empty string input as null
✅ RJSON.parse - Unicode and special characters
   ✅ should parse unicode characters in strings
   ✅ should parse japanese characters
   ✅ should parse string with special symbols
   ✅ should parse string with newline escape sequence
   ✅ should parse string with backslash
✅ RJSON.parse - Numbers edge cases
   ✅ should parse very large numbers
   ✅ should parse very small decimal numbers
   ✅ should parse negative zero
   ✅ should parse number with leading decimal point like .5
   ✅ should parse scientific notation with positive exponent
   ✅ should parse multiple negative numbers
✅ RJSON.parse - String escape sequences
   ✅ should parse escaped single quote
   ✅ should parse string with double quotes inside single quotes
   ✅ should parse backtick string with single quotes
   ✅ should parse string with mixed quote types
✅ RJSON.parse - Array edge cases
   ✅ should parse single element array with null
   ✅ should parse single element array
   ✅ should parse array with only undefined
   ✅ should parse deeply nested arrays
   ✅ should parse array with all null values
   ✅ should parse array with empty string values
   ✅ should parse array with mixed empties
✅ RJSON.parse - Object edge cases
   ✅ should parse object with only empty value
   ✅ should parse object with underscore in key
   ✅ should parse object with numbers in key
   ✅ should parse object with multiple dots in key
   ✅ should parse object with quoted key containing spaces
   ✅ should parse object with numeric string values
   ✅ should parse deeply nested objects
   ✅ should parse object with all falsy values
✅ RJSON.parse - Mapped arrays extended
   ✅ should parse mapped array with string value
   ✅ should parse mapped array with negative number
   ✅ should parse mapped array with single key
   ✅ should parse mapped array with many keys
✅ RJSON.stringify - Function coverage
   ✅ stringifyRJSONKey with simple key
   ✅ stringifyRJSONKey with spaces
   ✅ stringifyRJSONKey with special characters
   ✅ stringifyRJSONKey with empty string
   ✅ stringifyRJSONKey starting with number
   ✅ stringifyRJSONArray with empty array
   ✅ stringifyRJSONArray with primitives
   ✅ stringifyRJSONObject with empty object
   ✅ stringifyRJSONObject with various types
   ✅ stringifyRJSONString prefers single quotes
   ✅ stringifyRJSONString uses double quotes when needed
   ✅ stringifyRJSONString uses backticks for both quotes
   ✅ stringifyRJSONNumber prefers standard notation
   ✅ stringifyRJSONNumber uses exponent for very small
   ✅ stringifyRJSONNumber with zero
   ✅ stringifyRJSONBoolean with true
   ✅ stringifyRJSONBoolean with false
✅ RJSON.parse - Complex real-world examples
   ✅ should parse API response structure
   ✅ should parse query parameters structure
   ✅ should parse permission matrix
✅ RJSON.stringify - Complex real-world examples
   ✅ should stringify large user object
   ✅ should stringify filter query object
   ✅ should stringify mixed data structure
✅ RJSON roundtrip - Comprehensive
   ✅ should roundtrip object with all data types
   ✅ should roundtrip deeply nested structure
   ✅ should roundtrip large array
   ✅ should roundtrip object with many properties
   ✅ should roundtrip with unicode characters
✅ RJSON.rjson - Tagged template extended
   ✅ should parse with tagged template and simple structure
   ✅ should parse with tagged template and array
   ✅ should work with multiple template values
✅ RJSON API - Complete coverage
   ✅ RJSON.parse handles all types
   ✅ RJSON.stringify handles all types
   ✅ RJSON.stringifyKey works for various key types
   ✅ RJSON.stringifyObject creates valid objects
   ✅ RJSON.stringifyMappedArray creates valid mapped arrays
   ✅ RJSON.stringifyString handles quotes correctly
   ✅ RJSON.stringifyNumber handles various numbers
   ✅ RJSON.stringifyBoolean handles booleans
✅ Error handling - Extended
   ✅ should throw on completely invalid input
   ✅ should throw on mismatched brackets
   ✅ should throw on unterminated string
   ✅ should throw on invalid key value separator
   ✅ should throw on mismatched array brackets
   ✅ should throw on mapped array missing close
   ✅ should have detailed error messages with context
✅ Performance - Size and complexity
   ✅ should handle moderately large arrays
   ✅ should handle objects with many nested levels
   ✅ should handle mixed deeply nested structure
   ✅ should handle string with very long content
✅ Type preservation and identity
   ✅ should preserve null as null not undefined
   ✅ should preserve undefined as undefined
   ✅ should preserve 0 as 0 not false
   ✅ should preserve empty string as string
   ✅ should preserve arrays as arrays
   ✅ should preserve objects as objects
✅ Quote and escape handling
   ✅ should handle string with all quote types
   ✅ should escape quotes in key when necessary
   ✅ should handle backslashes in strings
```
