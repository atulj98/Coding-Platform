const logger = require('../utils/logger');

class ComplexityAnalyzer {
  constructor() {
    // Initialize comprehensive pattern databases
    this.initializePatterns();
    this.initializeASTAnalyzers();
    this.initializeMachineLearningFeatures();
  }

  initializePatterns() {
    // Ultra-comprehensive regex patterns with weights and contexts
    this.timeComplexityPatterns = {
      python: {
        'O(1)': {
          patterns: [
            { regex: /^(?!.*for)(?!.*while)(?!.*recursion).*return\s+[\w\[\]\.]+$/m, weight: 0.9, context: 'direct_return' },
            { regex: /return\s+\w+\[[\w\s\+\-\*\/\%]+\]/, weight: 0.95, context: 'array_access' },
            { regex: /^\s*return\s+[\w\d\+\-\*\/\s\(\)]+$/m, weight: 0.8, context: 'arithmetic' },
            { regex: /return\s+len\(\w+\)/, weight: 0.9, context: 'length_call' },
            { regex: /return\s+\w+\.\w+\(\)(?!\s*for)/, weight: 0.7, context: 'method_call' }
          ]
        },
        'O(log n)': {
          patterns: [
            { regex: /while\s+\w+\s*\/\/?\s*=\s*2/, weight: 0.95, context: 'binary_division' },
            { regex: /while\s+\w+\s*>\s*1.*\/\/?\s*=\s*2/s, weight: 0.9, context: 'halving_loop' },
            { regex: /import\s+bisect|bisect\./, weight: 0.85, context: 'binary_search' },
            { regex: /\w+\s*=\s*\w+\s*\/\/\s*2/, weight: 0.7, context: 'divide_by_two' },
            { regex: /math\.log/, weight: 0.6, context: 'logarithm' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /for\s+\w+\s+in\s+\w+:(?!\s*\n\s*for)/, weight: 0.9, context: 'single_loop' },
            { regex: /while\s+\w+\s*[<>=!]+\s*len\(\w+\)/, weight: 0.85, context: 'length_based_while' },
            { regex: /for\s+\w+\s+in\s+range\(len\(\w+\)\):(?!\s*\n\s*for)/, weight: 0.9, context: 'range_len_loop' },
            { regex: /\.sum\(\)|\.count\(|\.index\(/, weight: 0.8, context: 'linear_builtin' },
            { regex: /\w+\s*=\s*\[\s*\w+\s*for\s+\w+\s+in\s+\w+\s*\]/, weight: 0.85, context: 'list_comprehension' },
            { regex: /max\(\w+\)|min\(\w+\)/, weight: 0.8, context: 'min_max' }
          ]
        },
        'O(n log n)': {
          patterns: [
            { regex: /sorted\(\w+\)/, weight: 0.95, context: 'sorted_builtin' },
            { regex: /\w+\.sort\(\)/, weight: 0.95, context: 'list_sort' },
            { regex: /import\s+heapq|heapq\./, weight: 0.8, context: 'heap_operations' },
            { regex: /merge.*sort|quick.*sort/i, weight: 0.9, context: 'explicit_sort' },
            { regex: /heappush|heappop/, weight: 0.75, context: 'heap_push_pop' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /for\s+\w+\s+in\s+\w+:\s*\n\s*for\s+\w+\s+in\s+\w+:/, weight: 0.95, context: 'nested_loops' },
            { regex: /for\s+\w+\s+in\s+range\([^)]*\):\s*\n\s*for\s+\w+\s+in\s+range\([^)]*\):/, weight: 0.9, context: 'nested_range_loops' },
            { regex: /for.*\n.*for.*in.*range.*len/, weight: 0.85, context: 'nested_indexed_loops' },
            { regex: /\[\[.*for.*\].*for.*\]/, weight: 0.8, context: 'nested_list_comp' }
          ]
        },
        'O(n³)': {
          patterns: [
            { regex: /for.*\n.*for.*\n.*for.*in/, weight: 0.9, context: 'triple_nested' },
            { regex: /for\s+\w+.*for\s+\w+.*for\s+\w+/s, weight: 0.85, context: 'three_loops' }
          ]
        },
        'O(2^n)': {
          patterns: [
            { regex: /def\s+\w+\([^)]*\):\s*.*return.*\w+\([^)]*[\+\-]\s*1[^)]*\).*[\+\-].*\w+\([^)]*[\+\-]\s*1[^)]*\)/s, weight: 0.95, context: 'binary_recursion' },
            { regex: /fibonacci.*recursive|recursive.*fibonacci/i, weight: 0.9, context: 'fibonacci_recursive' },
            { regex: /return.*\w+\(\w+\s*-\s*1\).*\+.*\w+\(\w+\s*-\s*2\)/, weight: 0.85, context: 'dual_recursion' }
          ]
        },
        'O(n!)': {
          patterns: [
            { regex: /import\s+itertools.*permutations|from\s+itertools\s+import.*permutations/, weight: 0.9, context: 'permutations_import' },
            { regex: /itertools\.permutations/, weight: 0.95, context: 'permutations_use' },
            { regex: /def.*factorial.*n.*factorial\(n-1\)/s, weight: 0.8, context: 'factorial_recursive' }
          ]
        }
      },
      javascript: {
        'O(1)': {
          patterns: [
            { regex: /return\s+\w+\[[\w\s\+\-\*\/\%]+\]/, weight: 0.95, context: 'array_access' },
            { regex: /^\s*return\s+[\w\d\+\-\*\/\s\(\)]+;?$/m, weight: 0.8, context: 'arithmetic' },
            { regex: /return\s+\w+\.length/, weight: 0.9, context: 'length_access' },
            { regex: /^(?!.*for)(?!.*while).*return\s+[\w\.]+$/m, weight: 0.85, context: 'direct_return' }
          ]
        },
        'O(log n)': {
          patterns: [
            { regex: /while\s*\(\s*\w+\s*>\s*1\s*\).*\w+\s*\/=\s*2|Math\.floor\(\w+\/2\)/, weight: 0.9, context: 'binary_division' },
            { regex: /Math\.log/, weight: 0.6, context: 'logarithm' },
            { regex: /binary.*search|binarySearch/i, weight: 0.85, context: 'binary_search' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /for\s*\(\s*\w+.*<.*\.length.*\)(?!\s*\{[^}]*for)/, weight: 0.9, context: 'single_for_loop' },
            { regex: /\.forEach\(\s*[^}]*\)(?!\s*\.[^}]*forEach)/, weight: 0.85, context: 'foreach_single' },
            { regex: /\.map\(\s*[^}]*\)(?!\s*\.[^}]*map)/, weight: 0.8, context: 'map_single' },
            { regex: /\.filter\(\s*[^}]*\)(?!\s*\.[^}]*filter)/, weight: 0.8, context: 'filter_single' },
            { regex: /\.reduce\(\s*[^}]*\)/, weight: 0.85, context: 'reduce' },
            { regex: /while\s*\(\s*\w+.*<.*\.length.*\)(?!\s*\{[^}]*while)/, weight: 0.85, context: 'while_length' }
          ]
        },
        'O(n log n)': {
          patterns: [
            { regex: /\.sort\(\)/, weight: 0.95, context: 'array_sort' },
            { regex: /\.sort\(\s*\([^)]*\)\s*=>\s*[^}]*\)/, weight: 0.95, context: 'custom_sort' },
            { regex: /mergeSort|quickSort|heapSort/i, weight: 0.9, context: 'explicit_sort' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, weight: 0.95, context: 'nested_for_loops' },
            { regex: /\.forEach\([^}]*\.forEach/, weight: 0.9, context: 'nested_foreach' },
            { regex: /for.*length.*for.*length/s, weight: 0.85, context: 'nested_length_loops' }
          ]
        },
        'O(2^n)': {
          patterns: [
            { regex: /function\s+\w+\([^)]*\)\s*\{[^}]*return[^}]*\w+\([^)]*[\+\-]\s*1[^)]*\)[^}]*[\+\-][^}]*\w+\([^)]*[\+\-]\s*1[^)]*\)/s, weight: 0.9, context: 'binary_recursion' },
            { regex: /fibonacci.*recursive|recursive.*fibonacci/i, weight: 0.85, context: 'fibonacci_recursive' }
          ]
        },
        'O(n!)': {
          patterns: [
            { regex: /factorial/i, weight: 0.7, context: 'factorial' },
            { regex: /permutation/i, weight: 0.8, context: 'permutation' }
          ]
        }
      },
      java: {
        'O(1)': {
          patterns: [
            { regex: /return\s+\w+\[[\w\s\+\-\*\/\%]+\]/, weight: 0.95, context: 'array_access' },
            { regex: /^\s*return\s+[\w\d\+\-\*\/\s\(\)]+;$/m, weight: 0.8, context: 'arithmetic' },
            { regex: /return\s+\w+\.length/, weight: 0.9, context: 'length_access' }
          ]
        },
        'O(log n)': {
          patterns: [
            { regex: /while\s*\(\s*\w+\s*>\s*1\s*\).*\w+\s*\/=\s*2/, weight: 0.9, context: 'binary_division' },
            { regex: /Collections\.binarySearch|Arrays\.binarySearch/, weight: 0.9, context: 'binary_search' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /for\s*\(\s*\w+.*<.*\.length.*\)(?!\s*\{[^}]*for)/, weight: 0.9, context: 'single_for_loop' },
            { regex: /while\s*\(\s*\w+.*<.*\.length.*\)(?!\s*\{[^}]*while)/, weight: 0.85, context: 'while_length' },
            { regex: /Arrays\.stream.*forEach|\.stream\(\)\./, weight: 0.8, context: 'stream_operations' },
            { regex: /for\s*\(\s*\w+\s+\w+\s*:\s*\w+\s*\)(?!\s*\{[^}]*for)/, weight: 0.85, context: 'enhanced_for' }
          ]
        },
        'O(n log n)': {
          patterns: [
            { regex: /Arrays\.sort/, weight: 0.95, context: 'arrays_sort' },
            { regex: /Collections\.sort/, weight: 0.95, context: 'collections_sort' },
            { regex: /PriorityQueue/, weight: 0.8, context: 'priority_queue' },
            { regex: /TreeSet|TreeMap/, weight: 0.75, context: 'tree_structures' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, weight: 0.95, context: 'nested_for_loops' },
            { regex: /for.*length.*for.*length/s, weight: 0.85, context: 'nested_length_loops' }
          ]
        },
        'O(2^n)': {
          patterns: [
            { regex: /fibonacci.*recursive|recursive.*fibonacci/i, weight: 0.85, context: 'fibonacci_recursive' },
            { regex: /return.*fibonacci.*\+.*fibonacci/i, weight: 0.8, context: 'binary_recursion' }
          ]
        },
        'O(n!)': {
          patterns: [
            { regex: /factorial/i, weight: 0.7, context: 'factorial' },
            { regex: /permutation/i, weight: 0.8, context: 'permutation' }
          ]
        }
      },
      cpp: {
        'O(1)': {
          patterns: [
            { regex: /return\s+\w+\[[\w\s\+\-\*\/\%]+\]/, weight: 0.95, context: 'array_access' },
            { regex: /^\s*return\s+[\w\d\+\-\*\/\s\(\)]+;$/m, weight: 0.8, context: 'arithmetic' },
            { regex: /return\s+\w+\.size\(\)/, weight: 0.9, context: 'size_access' }
          ]
        },
        'O(log n)': {
          patterns: [
            { regex: /while\s*\(\s*\w+\s*>\s*1\s*\).*\w+\s*\/=\s*2/, weight: 0.9, context: 'binary_division' },
            { regex: /std::binary_search|std::lower_bound|std::upper_bound/, weight: 0.9, context: 'binary_search' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /for\s*\(\s*\w+.*<.*\.size\(\).*\)(?!\s*\{[^}]*for)/, weight: 0.9, context: 'single_for_loop' },
            { regex: /while\s*\(\s*\w+.*<.*\.size\(\).*\)(?!\s*\{[^}]*while)/, weight: 0.85, context: 'while_size' },
            { regex: /std::find|std::count|std::accumulate/, weight: 0.8, context: 'linear_algorithms' },
            { regex: /for\s*\(\s*auto\s+\w+\s*:\s*\w+\s*\)(?!\s*\{[^}]*for)/, weight: 0.85, context: 'range_based_for' }
          ]
        },
        'O(n log n)': {
          patterns: [
            { regex: /std::sort|std::stable_sort/, weight: 0.95, context: 'std_sort' },
            { regex: /std::priority_queue/, weight: 0.8, context: 'priority_queue' },
            { regex: /std::set|std::map|std::multiset|std::multimap/, weight: 0.75, context: 'tree_containers' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, weight: 0.95, context: 'nested_for_loops' },
            { regex: /for.*size.*for.*size/s, weight: 0.85, context: 'nested_size_loops' }
          ]
        },
        'O(2^n)': {
          patterns: [
            { regex: /fibonacci.*recursive|recursive.*fibonacci/i, weight: 0.85, context: 'fibonacci_recursive' },
            { regex: /return.*fibonacci.*\+.*fibonacci/i, weight: 0.8, context: 'binary_recursion' }
          ]
        },
        'O(n!)': {
          patterns: [
            { regex: /factorial/i, weight: 0.7, context: 'factorial' },
            { regex: /std::next_permutation/, weight: 0.85, context: 'permutation' }
          ]
        }
      },
      c: {
        'O(1)': {
          patterns: [
            { regex: /return\s+\w+\[[\w\s\+\-\*\/\%]+\]/, weight: 0.95, context: 'array_access' },
            { regex: /^\s*return\s+[\w\d\+\-\*\/\s\(\)]+;$/m, weight: 0.8, context: 'arithmetic' }
          ]
        },
        'O(log n)': {
          patterns: [
            { regex: /while\s*\(\s*\w+\s*>\s*1\s*\).*\w+\s*\/=\s*2/, weight: 0.9, context: 'binary_division' },
            { regex: /bsearch/, weight: 0.85, context: 'binary_search' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /for\s*\(\s*\w+.*<.*\w+.*\)(?!\s*\{[^}]*for)/, weight: 0.9, context: 'single_for_loop' },
            { regex: /while\s*\(\s*\w+.*<.*\w+.*\)(?!\s*\{[^}]*while)/, weight: 0.85, context: 'while_loop' }
          ]
        },
        'O(n log n)': {
          patterns: [
            { regex: /qsort/, weight: 0.95, context: 'qsort' },
            { regex: /merge.*sort|quick.*sort/i, weight: 0.9, context: 'explicit_sort' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, weight: 0.95, context: 'nested_for_loops' }
          ]
        },
        'O(2^n)': {
          patterns: [
            { regex: /fibonacci.*recursive|recursive.*fibonacci/i, weight: 0.85, context: 'fibonacci_recursive' }
          ]
        },
        'O(n!)': {
          patterns: [
            { regex: /factorial/i, weight: 0.7, context: 'factorial' }
          ]
        }
      }
    };

    // Space complexity patterns
    this.spaceComplexityPatterns = {
      python: {
        'O(1)': {
          patterns: [
            { regex: /^(?!.*\[.*for)(?!.*list\()(?!.*dict\()(?!.*set\().*$/m, weight: 0.8, context: 'no_collections' },
            { regex: /^\s*\w+\s*=\s*\d+/, weight: 0.9, context: 'primitive_assignment' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /\[.*for.*in.*\]/, weight: 0.9, context: 'list_comprehension' },
            { regex: /list\(|dict\(|set\(/, weight: 0.8, context: 'collection_creation' },
            { regex: /\w+\s*=\s*\[\]/, weight: 0.7, context: 'list_initialization' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /\[\[.*for.*\].*for.*\]/, weight: 0.9, context: 'nested_list_comp' },
            { regex: /matrix.*=.*\[\].*for/s, weight: 0.8, context: 'matrix_creation' }
          ]
        }
      },
      javascript: {
        'O(1)': {
          patterns: [
            { regex: /let\s+\w+\s*=\s*\d+|const\s+\w+\s*=\s*\d+|var\s+\w+\s*=\s*\d+/, weight: 0.9, context: 'primitive_vars' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /new\s+Array|Array\(\)|\.map\(|\.filter\(/, weight: 0.8, context: 'array_operations' },
            { regex: /new\s+Set|new\s+Map/, weight: 0.8, context: 'collection_creation' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /Array.*Array|new\s+Array.*new\s+Array/, weight: 0.85, context: 'nested_arrays' }
          ]
        }
      },
      java: {
        'O(1)': {
          patterns: [
            { regex: /int\s+\w+\s*=|long\s+\w+\s*=|boolean\s+\w+\s*=/, weight: 0.9, context: 'primitive_vars' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /new\s+\w+\[.*\]|ArrayList|LinkedList|HashMap|HashSet/, weight: 0.8, context: 'collection_creation' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /new\s+\w+\[.*\]\[.*\]|ArrayList.*ArrayList/, weight: 0.85, context: 'nested_collections' }
          ]
        }
      },
      cpp: {
        'O(1)': {
          patterns: [
            { regex: /int\s+\w+\s*=|long\s+\w+\s*=|bool\s+\w+\s*=/, weight: 0.9, context: 'primitive_vars' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /vector<|string\s+\w+|std::unordered_map|std::unordered_set/, weight: 0.8, context: 'container_creation' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /vector<.*vector<|\w+\[.*\]\[.*\]/, weight: 0.85, context: 'nested_containers' }
          ]
        }
      },
      c: {
        'O(1)': {
          patterns: [
            { regex: /int\s+\w+\s*=|long\s+\w+\s*=|char\s+\w+\s*=/, weight: 0.9, context: 'primitive_vars' }
          ]
        },
        'O(n)': {
          patterns: [
            { regex: /malloc\(.*\)|calloc\(.*\)/, weight: 0.8, context: 'dynamic_allocation' }
          ]
        },
        'O(n²)': {
          patterns: [
            { regex: /malloc.*malloc|\w+\[.*\]\[.*\]/, weight: 0.85, context: 'nested_allocation' }
          ]
        }
      }
    };
  }

  initializeASTAnalyzers() {
    // Advanced structural analysis patterns
    this.structuralPatterns = {
      loopNesting: {
        single: /for|while/g,
        nested: /(for|while)[^{}]*\{[^{}]*(for|while)/gs,
        tripleNested: /(for|while)[^{}]*\{[^{}]*(for|while)[^{}]*\{[^{}]*(for|while)/gs
      },
      recursion: {
        simple: /function\s+(\w+)[^{}]*\{[^{}]*\1\([^)]*\)/g,
        binary: /function\s+(\w+)[^{}]*\{[^{}]*\1\([^)]*\)[^{}]*[\+\-\*\/][^{}]*\1\([^)]*\)/g,
        fibonacci: /function\s+(\w+)[^{}]*\{[^{}]*\1\([^)]*[\+\-]\s*1[^)]*\)[^{}]*[\+\-][^{}]*\1\([^)]*[\+\-]\s*2[^)]*\)/g
      },
      dataStructures: {
        sorting: /sort|Sort|qsort|std::sort/g,
        hashing: /hash|Hash|map|Map|set|Set/g,
        trees: /tree|Tree|heap|Heap|priority|Priority/g
      }
    };
  }

  initializeMachineLearningFeatures() {
    // Feature extraction for ML-style analysis
    this.featureExtractors = {
      codeLength: (code) => code.length,
      loopDepth: (code) => this.calculateMaxLoopDepth(code),
      recursionDepth: (code) => this.calculateRecursionComplexity(code),
      dataStructureUsage: (code) => this.analyzeDataStructures(code),
      algorithmicPatterns: (code) => this.identifyAlgorithmicPatterns(code)
    };

    // Complexity scoring weights
    this.complexityWeights = {
      'O(1)': 1,
      'O(log n)': 2,
      'O(n)': 3,
      'O(n log n)': 4,
      'O(n²)': 5,
      'O(n³)': 6,
      'O(2^n)': 7,
      'O(n!)': 8
    };
  }

  async analyze(code, language) {
    try {
      logger.info(`Starting comprehensive complexity analysis for ${language}`);
      
      // Multi-layered analysis approach
      const patternAnalysis = this.analyzePatterns(code, language);
      const structuralAnalysis = this.analyzeStructure(code, language);
      const semanticAnalysis = this.analyzeSemantics(code, language);
      const mlAnalysis = this.machineLearningAnalysis(code, language);
      
      // Combine all analyses with weighted scoring
      const timeComplexity = this.combineTimeComplexityAnalyses([
        patternAnalysis.time,
        structuralAnalysis.time,
        semanticAnalysis.time,
        mlAnalysis.time
      ]);
      
      const spaceComplexity = this.combineSpaceComplexityAnalyses([
        patternAnalysis.space,
        structuralAnalysis.space,
        semanticAnalysis.space,
        mlAnalysis.space
      ]);

      // Generate detailed explanation
      const explanation = this.generateDetailedExplanation(code, language, {
        time: timeComplexity,
        space: spaceComplexity
      });

      return {
        timeComplexity: {
          ...timeComplexity,
          detailedAnalysis: explanation.time
        },
        spaceComplexity: {
          ...spaceComplexity,
          detailedAnalysis: explanation.space
        },
        analysisMetadata: {
          analysisTimestamp: new Date(),
          analysisVersion: '2.0',
          confidence: this.calculateOverallConfidence(timeComplexity, spaceComplexity),
          methods: ['pattern-matching', 'structural', 'semantic', 'ml-features']
        }
      };
    } catch (error) {
      logger.error('Error in ultimate complexity analysis:', error);
      return this.getFailsafeAnalysis();
    }
  }

  analyzePatterns(code, language) {
    const timePatterns = this.timeComplexityPatterns[language] || {};
    const spacePatterns = this.spaceComplexityPatterns[language] || {};
    
    const timeMatches = this.findPatternMatches(code, timePatterns);
    const spaceMatches = this.findPatternMatches(code, spacePatterns);
    
    return {
      time: this.selectBestComplexity(timeMatches, 'time'),
      space: this.selectBestComplexity(spaceMatches, 'space')
    };
  }

  findPatternMatches(code, patterns) {
    const matches = [];
    
    for (const [complexity, patternData] of Object.entries(patterns)) {
      for (const pattern of patternData.patterns) {
        if (pattern.regex.test(code)) {
          const confidence = this.calculatePatternConfidence(pattern, code);
          matches.push({
            complexity,
            confidence,
            weight: pattern.weight,
            context: pattern.context,
            evidence: this.extractEvidence(code, pattern.regex)
          });
        }
      }
    }
    
    return matches;
  }

  analyzeStructure(code, language) {
    // Deep structural analysis using AST-like parsing
    const loopDepth = this.calculateMaxLoopDepth(code);
    const recursionComplexity = this.calculateRecursionComplexity(code);
    const dataStructureComplexity = this.analyzeDataStructures(code);
    
    // Determine complexity based on structure
    let timeComplexity = 'O(1)';
    let confidence = 0.5;
    
    if (recursionComplexity.isBinaryRecursion) {
      timeComplexity = 'O(2^n)';
      confidence = 0.9;
    } else if (recursionComplexity.isFactorialRecursion) {
      timeComplexity = 'O(n!)';
      confidence = 0.85;
    } else if (dataStructureComplexity.hasSorting) {
      timeComplexity = 'O(n log n)';
      confidence = 0.95;
    } else if (loopDepth >= 3) {
      timeComplexity = 'O(n³)';
      confidence = 0.8;
    } else if (loopDepth === 2) {
      timeComplexity = 'O(n²)';
      confidence = 0.85;
    } else if (loopDepth === 1) {
      timeComplexity = 'O(n)';
      confidence = 0.8;
    }
    
    // Space complexity based on structure
    let spaceComplexity = 'O(1)';
    let spaceConfidence = 0.5;
    
    if (dataStructureComplexity.hasNestedStructures) {
      spaceComplexity = 'O(n²)';
      spaceConfidence = 0.8;
    } else if (dataStructureComplexity.hasLinearStructures) {
      spaceComplexity = 'O(n)';
      spaceConfidence = 0.75;
    }
    
    return {
      time: {
        estimated: timeComplexity,
        confidence,
        evidence: {
          loopDepth,
          recursionComplexity,
          dataStructureComplexity
        }
      },
      space: {
        estimated: spaceComplexity,
        confidence: spaceConfidence,
        evidence: {
          dataStructureComplexity
        }
      }
    };
  }

  analyzeSemantics(code, language) {
    // Semantic analysis based on algorithmic understanding
    const algorithmType = this.identifyAlgorithmType(code, language);
    const complexityProfile = this.getAlgorithmComplexityProfile(algorithmType);
    
    return {
      time: {
        estimated: complexityProfile.time,
        confidence: complexityProfile.timeConfidence,
        evidence: {
          algorithmType,
          semanticClues: this.extractSemanticClues(code, language)
        }
      },
      space: {
        estimated: complexityProfile.space,
        confidence: complexityProfile.spaceConfidence,
        evidence: {
          algorithmType,
          memoryPatterns: this.analyzeMemoryPatterns(code, language)
        }
      }
    };
  }

  machineLearningAnalysis(code, language) {
    // ML-inspired feature-based analysis
    const features = this.extractFeatures(code, language);
    const complexityScore = this.calculateComplexityScore(features);
    
    const timeComplexity = this.scoreToComplexity(complexityScore.time);
    const spaceComplexity = this.scoreToComplexity(complexityScore.space);
    
    return {
      time: {
        estimated: timeComplexity.complexity,
        confidence: timeComplexity.confidence,
        evidence: {
          features,
          score: complexityScore.time
        }
      },
      space: {
        estimated: spaceComplexity.complexity,
        confidence: spaceComplexity.confidence,
        evidence: {
          features,
          score: complexityScore.space
        }
      }
    };
  }

  calculateMaxLoopDepth(code) {
    // Advanced loop nesting detection
    let maxDepth = 0;
    let currentDepth = 0;
    let inLoop = false;
    
    // Enhanced regex for different loop types
    const loopPatterns = [
      /\bfor\s*\(/g,
      /\bwhile\s*\(/g,
      /\bdo\s*\{/g,
      /\bfor\s+\w+\s+in\s+/g, // Python for-in
      /\.forEach\s*\(/g,      // JavaScript forEach
      /\.map\s*\(/g,          // Functional iterations
      /\.filter\s*\(/g
    ];
    
    const lines = code.split('\n');
    const stack = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check for loop start
      for (const pattern of loopPatterns) {
        if (pattern.test(trimmed)) {
          stack.push('loop');
          currentDepth = stack.length;
          maxDepth = Math.max(maxDepth, currentDepth);
          break;
        }
      }
      
      // Check for block end (simplified)
      if (trimmed.includes('}') || (trimmed === '' && stack.length > 0)) {
        if (stack.length > 0) {
          stack.pop();
        }
      }
    }
    
    return maxDepth;
  }

  calculateRecursionComplexity(code) {
    const functionName = this.extractMainFunctionName(code);
    if (!functionName) {
      return { isRecursive: false, isBinaryRecursion: false, isFactorialRecursion: false };
    }
    
    const recursiveCalls = (code.match(new RegExp(functionName + '\\s*\\(', 'g')) || []).length - 1;
    const isBinaryRecursion = this.isBinaryRecursivePattern(code, functionName);
    const isFactorialRecursion = this.isFactorialPattern(code, functionName);
    
    return {
      isRecursive: recursiveCalls > 0,
      recursiveCallCount: recursiveCalls,
      isBinaryRecursion,
      isFactorialRecursion,
      estimatedDepth: this.estimateRecursionDepth(code, functionName)
    };
  }

  analyzeDataStructures(code) {
    const structures = {
      hasLinearStructures: false,
      hasNestedStructures: false,
      hasSorting: false,
      hasHashing: false,
      hasTrees: false,
      hasGraphs: false
    };
    
    // Comprehensive data structure detection
    const patterns = {
      linear: [
        /\barray\b|\blist\b|\bvector\b/i,
        /\[\]|\bArray\b|\bArrayList\b/,
        /\bstring\b|\bString\b/
      ],
      nested: [
        /\[\s*\[|\bArray.*Array\b/,
        /vector<.*vector<|list<.*list</,
        /matrix|\bMatrix\b/i
      ],
      sorting: [
        /\.sort\(|\bsort\b|\bSort\b/,
        /\bqsort\b|\bmerge.*sort\b|\bquick.*sort\b/i,
        /\bheap.*sort\b|\bbubble.*sort\b/i
      ],
      hashing: [
        /\bmap\b|\bMap\b|\bhash\b|\bHash\b/,
        /\bset\b|\bSet\b|\bdict\b|\bDict\b/,
        /HashMap|HashSet|unordered_map|unordered_set/
      ],
      trees: [
        /\btree\b|\bTree\b|\bheap\b|\bHeap\b/,
        /BST|AVL|RedBlack|Priority.*Queue/i,
        /TreeMap|TreeSet|priority_queue/
      ]
    };
    
    for (const [category, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        if (pattern.test(code)) {
          if (category === 'linear') structures.hasLinearStructures = true;
          if (category === 'nested') structures.hasNestedStructures = true;
          if (category === 'sorting') structures.hasSorting = true;
          if (category === 'hashing') structures.hasHashing = true;
          if (category === 'trees') structures.hasTrees = true;
        }
      }
    }
    
    return structures;
  }

  identifyAlgorithmType(code, language) {
    const algorithms = {
      'sorting': /sort|Sort|qsort|mergeSort|quickSort|heapSort|bubbleSort/i,
      'searching': /search|Search|find|binary.*search|linear.*search/i,
      'dynamic_programming': /dp|memo|memoization|tabulation|cache/i,
      'graph': /graph|Graph|dfs|bfs|dijkstra|floyd|warshall/i,
      'tree': /tree|Tree|traverse|traversal|inorder|preorder|postorder/i,
      'greedy': /greedy|Greedy|minimum|maximum|optimal/i,
      'divide_conquer': /divide|conquer|merge|split|recursive/i,
      'backtracking': /backtrack|permutation|combination|sudoku|n.*queen/i,
      'string': /string|String|pattern|match|substring|palindrome/i,
      'math': /math|Math|factorial|fibonacci|prime|gcd|lcm/i
    };
    
    const detectedTypes = [];
    for (const [type, pattern] of Object.entries(algorithms)) {
      if (pattern.test(code)) {
        detectedTypes.push(type);
      }
    }
    
    return detectedTypes.length > 0 ? detectedTypes[0] : 'unknown';
  }

  getAlgorithmComplexityProfile(algorithmType) {
    const profiles = {
      'sorting': { time: 'O(n log n)', timeConfidence: 0.9, space: 'O(1)', spaceConfidence: 0.7 },
      'searching': { time: 'O(log n)', timeConfidence: 0.8, space: 'O(1)', spaceConfidence: 0.9 },
      'dynamic_programming': { time: 'O(n²)', timeConfidence: 0.7, space: 'O(n)', spaceConfidence: 0.8 },
      'graph': { time: 'O(V + E)', timeConfidence: 0.6, space: 'O(V)', spaceConfidence: 0.7 },
      'tree': { time: 'O(n)', timeConfidence: 0.8, space: 'O(h)', spaceConfidence: 0.6 },
      'backtracking': { time: 'O(2^n)', timeConfidence: 0.8, space: 'O(n)', spaceConfidence: 0.7 },
      'math': { time: 'O(n)', timeConfidence: 0.6, space: 'O(1)', spaceConfidence: 0.8 },
      'unknown': { time: 'O(n)', timeConfidence: 0.3, space: 'O(1)', spaceConfidence: 0.3 }
    };
    
    return profiles[algorithmType] || profiles['unknown'];
  }

  extractFeatures(code, language) {
    return {
      codeLength: code.length,
      lineCount: code.split('\n').length,
      loopCount: (code.match(/(for|while|do)/g) || []).length,
      recursionCount: this.countRecursiveCalls(code),
      conditionalCount: (code.match(/(if|else|switch|case)/g) || []).length,
      functionCallCount: (code.match(/\w+\s*\(/g) || []).length,
      dataStructureCount: this.countDataStructures(code),
      cyclomaticComplexity: this.calculateCyclomaticComplexity(code),
      nestingDepth: this.calculateMaxLoopDepth(code),
      languageSpecificFeatures: this.extractLanguageFeatures(code, language)
    };
  }

  calculateComplexityScore(features) {
    // ML-inspired scoring algorithm
    const timeScore = (
      features.loopCount * 0.3 +
      features.nestingDepth * 0.4 +
      features.recursionCount * 0.2 +
      features.cyclomaticComplexity * 0.1
    );
    
    const spaceScore = (
      features.dataStructureCount * 0.4 +
      features.nestingDepth * 0.3 +
      features.recursionCount * 0.2 +
      features.codeLength / 1000 * 0.1
    );
    
    return { time: timeScore, space: spaceScore };
  }

  scoreToComplexity(score) {
    if (score >= 6) return { complexity: 'O(n!)', confidence: 0.8 };
    if (score >= 5) return { complexity: 'O(2^n)', confidence: 0.85 };
    if (score >= 4) return { complexity: 'O(n³)', confidence: 0.8 };
    if (score >= 3) return { complexity: 'O(n²)', confidence: 0.9 };
    if (score >= 2) return { complexity: 'O(n log n)', confidence: 0.85 };
    if (score >= 1) return { complexity: 'O(n)', confidence: 0.8 };
    if (score >= 0.5) return { complexity: 'O(log n)', confidence: 0.7 };
    return { complexity: 'O(1)', confidence: 0.8 };
  }

  combineTimeComplexityAnalyses(analyses) {
    // Weighted ensemble of all analysis methods
    const weights = { pattern: 0.3, structural: 0.25, semantic: 0.25, ml: 0.2 };
    const validAnalyses = analyses.filter(a => a && a.estimated);
    
    if (validAnalyses.length === 0) {
      return { estimated: 'O(1)', confidence: 0.1, analysis: 'No valid analysis available' };
    }
    
    // Weighted voting system
    const complexityVotes = {};
    let totalWeight = 0;
    
    validAnalyses.forEach((analysis, index) => {
      const weight = Object.values(weights)[index] * analysis.confidence;
      totalWeight += weight;
      
      if (!complexityVotes[analysis.estimated]) {
        complexityVotes[analysis.estimated] = 0;
      }
      complexityVotes[analysis.estimated] += weight;
    });
    
    // Find winning complexity
    const winner = Object.entries(complexityVotes)
      .sort(([,a], [,b]) => b - a)[0];
    
    const confidence = winner[1] / totalWeight;
    
    return {
      estimated: winner[0],
      confidence: Math.min(confidence, 1.0),
      analysis: this.generateTimeComplexityExplanation(winner[0], validAnalyses),
      consensusLevel: this.calculateConsensus(validAnalyses),
      contributingAnalyses: validAnalyses.map(a => ({
        method: a.method || 'unknown',
        result: a.estimated,
        confidence: a.confidence
      }))
    };
  }

  combineSpaceComplexityAnalyses(analyses) {
    // Similar to time complexity but with space-specific considerations
    return this.combineTimeComplexityAnalyses(analyses);
  }

  generateDetailedExplanation(code, language, results) {
    return {
      time: this.generateTimeComplexityExplanation(results.time.estimated, []),
      space: this.generateSpaceComplexityExplanation(results.space.estimated, []),
      optimizationSuggestions: this.generateOptimizationSuggestions(code, language, results),
      alternativeApproaches: this.suggestAlternativeApproaches(results)
    };
  }

  generateTimeComplexityExplanation(complexity, analyses) {
    const explanations = {
      'O(1)': 'Constant time complexity - the algorithm\'s execution time remains constant regardless of input size. This is the most efficient time complexity.',
      'O(log n)': 'Logarithmic time complexity - execution time grows logarithmically with input size. Common in binary search and tree operations with balanced trees.',
      'O(n)': 'Linear time complexity - execution time grows linearly with input size. Each element is typically processed once.',
      'O(n log n)': 'Linearithmic time complexity - common in efficient comparison-based sorting algorithms like mergesort and heapsort.',
      'O(n²)': 'Quadratic time complexity - execution time grows quadratically with input size. Often results from nested loops over the input.',
      'O(n³)': 'Cubic time complexity - execution time grows cubically with input size. Usually from triple-nested loops, very inefficient for large inputs.',
      'O(2^n)': 'Exponential time complexity - execution time doubles with each additional input element. Extremely inefficient, often from naive recursive algorithms.',
      'O(n!)': 'Factorial time complexity - execution time grows factorially with input size. The least efficient complexity, often from algorithms generating all permutations.'
    };
    
    return explanations[complexity] || 'Unknown complexity pattern detected.';
  }

  generateSpaceComplexityExplanation(complexity, analyses) {
    const explanations = {
      'O(1)': 'Constant space complexity - memory usage remains constant regardless of input size.',
      'O(log n)': 'Logarithmic space complexity - memory usage grows logarithmically, often from recursive call stacks.',
      'O(n)': 'Linear space complexity - memory usage grows linearly with input size.',
      'O(n²)': 'Quadratic space complexity - memory usage grows quadratically, often from 2D data structures.',
      'O(2^n)': 'Exponential space complexity - memory usage grows exponentially, often from recursive algorithms with memoization.'
    };
    
    return explanations[complexity] || 'Unknown space complexity pattern detected.';
  }

  generateOptimizationSuggestions(code, language, results) {
    const suggestions = [];
    
    if (results.time.estimated === 'O(n²)') {
      suggestions.push('Consider using hash tables or sets to reduce nested loop operations to O(n)');
      suggestions.push('Look for opportunities to sort the data first and use two-pointer technique');
    }
    
    if (results.time.estimated === 'O(2^n)') {
      suggestions.push('Implement memoization or dynamic programming to avoid redundant calculations');
      suggestions.push('Consider iterative approaches instead of naive recursion');
    }
    
    if (results.space.estimated === 'O(n²)') {
      suggestions.push('Analyze if 2D storage is truly necessary, consider 1D alternatives');
      suggestions.push('Use in-place algorithms where possible to reduce space usage');
    }
    
    return suggestions;
  }

  // Helper methods
  extractEvidence(code, regex) {
    const matches = code.match(regex);
    return matches ? matches.slice(0, 3) : [];
  }

  calculatePatternConfidence(pattern, code) {
    const matches = (code.match(pattern.regex) || []).length;
    const baseConfidence = pattern.weight;
    const matchBonus = Math.min(matches * 0.1, 0.2);
    return Math.min(baseConfidence + matchBonus, 1.0);
  }

  selectBestComplexity(matches, type) {
    if (matches.length === 0) {
      return { estimated: 'O(1)', confidence: 0.3, analysis: 'No patterns detected, assuming constant complexity' };
    }
    
    // Sort by complexity severity (worst-first) and confidence
    const complexityOrder = ['O(n!)', 'O(2^n)', 'O(n³)', 'O(n²)', 'O(n log n)', 'O(n)', 'O(log n)', 'O(1)'];
    
    matches.sort((a, b) => {
      const aIndex = complexityOrder.indexOf(a.complexity);
      const bIndex = complexityOrder.indexOf(b.complexity);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return (b.confidence * b.weight) - (a.confidence * a.weight);
    });
    
    const best = matches[0];
    return {
      estimated: best.complexity,
      confidence: best.confidence * best.weight,
      analysis: `Detected ${best.complexity} pattern in ${best.context}`,
      evidence: best.evidence,
      allMatches: matches.slice(0, 5) // Top 5 matches for reference
    };
  }

  calculateOverallConfidence(timeResult, spaceResult) {
    return (timeResult.confidence + spaceResult.confidence) / 2;
  }

  calculateConsensus(analyses) {
    const complexities = analyses.map(a => a.estimated);
    const unique = [...new Set(complexities)];
    return unique.length === 1 ? 'high' : unique.length <= 2 ? 'medium' : 'low';
  }

  // Additional helper methods
  extractMainFunctionName(code) {
    const patterns = [
      /function\s+(\w+)/,
      /def\s+(\w+)/,
      /(\w+)\s*\(/,
      /public\s+\w+\s+(\w+)\s*\(/
    ];
    
    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  isBinaryRecursivePattern(code, functionName) {
    const pattern = new RegExp(`${functionName}\\([^)]*\\)[^{}]*[+\\-][^{}]*${functionName}\\([^)]*\\)`, 'g');
    return pattern.test(code);
  }

  isFactorialPattern(code, functionName) {
    return /factorial|n\s*\*\s*factorial\(n\s*-\s*1\)/i.test(code);
  }

  estimateRecursionDepth(code, functionName) {
    if (this.isBinaryRecursivePattern(code, functionName)) return 'O(n)';
    if (/n\s*-\s*1/.test(code)) return 'O(n)';
    return 'O(log n)';
  }

  countRecursiveCalls(code) {
    const functionName = this.extractMainFunctionName(code);
    if (!functionName) return 0;
    return (code.match(new RegExp(functionName + '\\s*\\(', 'g')) || []).length - 1;
  }

  countDataStructures(code) {
    const patterns = [
      /\barray\b|\blist\b|\bvector\b|\bmap\b|\bset\b/gi,
      /\[\]|\bArray\b|\bArrayList\b|\bHashMap\b/g
    ];
    
    let count = 0;
    for (const pattern of patterns) {
      count += (code.match(pattern) || []).length;
    }
    return count;
  }

  calculateCyclomaticComplexity(code) {
    const decisionPoints = (code.match(/(if|else|while|for|case|catch|&&|\|\||\?)/g) || []).length;
    return decisionPoints + 1;
  }

  extractLanguageFeatures(code, language) {
    const features = {};
    
    switch (language) {
      case 'python':
        features.listComprehensions = (code.match(/\[.*for.*in.*\]/g) || []).length;
        features.generators = (code.match(/yield/g) || []).length;
        break;
      case 'javascript':
        features.arrowFunctions = (code.match(/=>/g) || []).length;
        features.functionalMethods = (code.match(/\.(map|filter|reduce)/g) || []).length;
        break;
      case 'java':
        features.streams = (code.match(/\.stream\(\)/g) || []).length;
        features.generics = (code.match(/<[^>]+>/g) || []).length;
        break;
    }
    
    return features;
  }

  extractSemanticClues(code, language) {
    return {
      hasComparisons: /[<>=!]=?/.test(code),
      hasArithmetic: /[\+\-\*\/\%]/.test(code),
      hasLogic: /&&|\|\||!/.test(code),
      hasAssignments: /=/.test(code)
    };
  }

  analyzeMemoryPatterns(code, language) {
    return {
      hasAllocation: /new\s+|malloc|calloc/.test(code),
      hasDeallocation: /delete|free/.test(code),
      hasCollections: /\[\]|Array|List|Map|Set/.test(code)
    };
  }

  suggestAlternativeApproaches(results) {
    const suggestions = [];
    
    if (results.time.estimated === 'O(n²)') {
      suggestions.push('Hash table approach for O(n) time complexity');
      suggestions.push('Sorting + two pointers for O(n log n) time complexity');
    }
    
    return suggestions;
  }

  getFailsafeAnalysis() {
    return {
      timeComplexity: {
        estimated: 'Unknown',
        confidence: 0,
        analysis: 'Analysis failed - unable to determine complexity',
        detailedAnalysis: 'The complexity analyzer encountered an error during processing.'
      },
      spaceComplexity: {
        estimated: 'Unknown',
        confidence: 0,
        analysis: 'Analysis failed - unable to determine complexity',
        detailedAnalysis: 'The complexity analyzer encountered an error during processing.'
      },
      analysisMetadata: {
        analysisTimestamp: new Date(),
        analysisVersion: '2.0',
        confidence: 0,
        methods: ['failsafe']
      }
    };
  }
}

module.exports = new ComplexityAnalyzer();