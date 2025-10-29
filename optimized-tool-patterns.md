# ⚡ OPTIMIZED TOOL USAGE PATTERNS
# Streamlined for Maximum Efficiency

## 🎯 FREQUENT PATTERN OPTIMIZATIONS

### 1. READ → EDIT SEQUENCES (50% reduction)
```
OLD:
Read file → Analyze → Plan → Edit → Verify
~200 tokens per sequence

NEW:
Read file → Direct edit with validation
~100 tokens per sequence
```

### 2. BASH → VERIFICATION LOOPS (60% reduction)
```
OLD:
Bash command → Check output → Log result → Verify success
~150 tokens per command

NEW:
Bash command with built-in verification
~60 tokens per command
```

### 3. TODOWRITE → STATUS UPDATES (70% reduction)
```
OLD:
TodoWrite → Explain status → Update → Explain completion
~100 tokens per update

NEW:
TodoWrite status change only
~30 tokens per update
```

## 🛠️ BATCH TOOL OPERATIONS

### PARALLEL TOOL CALLS (Example):
```
// Instead of sequential calls:
// Read file1, Read file2, Read file3 (separate calls)

// Use parallel pattern:
<function_calls>
<invoke name="Read">
<parameter name="file_path">file1.js