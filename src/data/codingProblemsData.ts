import { CodingProblem } from '../types';

export const CODING_PROBLEMS_DATA: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    companyTags: ['Amazon', 'Flipkart', 'TCS Digital', 'Microsoft', 'Zoho'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Return the indices in any order.',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6, return [1, 2].',
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for(int i=0; i<nums.size(); ++i) {\n        int comp = target - nums[i];\n        if(mp.count(comp)) return {mp[comp], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}`,
      java: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) return new int[] { map.get(complement), i };\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
      { input: '[3, 3], 6', expectedOutput: '[0, 1]' },
    ],
    timeComplexity: 'O(N) with Hash Map lookup',
    spaceComplexity: 'O(N) aux storage for hash map',
    hints: [
      'Can you solve this in one single pass through the array?',
      'Instead of looking ahead with a nested O(N^2) loop, store the elements you have already seen in a Hash Map with their indices.',
    ],
    solutionExplanation:
      'We maintain a hash map where keys are numbers and values are their corresponding indices. As we iterate through each element nums[i], we calculate complement = target - nums[i]. If complement is already present in our map, we immediately return the pair of indices.',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack/Queue',
    companyTags: ['Infosys DSE', 'TCS Prime', 'Wipro', 'Amazon'],
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets, and in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (char in pairs) {\n      if (stack.pop() !== pairs[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0`,
      cpp: `bool isValid(string s) {\n    stack<char> st;\n    for(char c : s) {\n        if(c == \'(\' || c == \'{\\\' || c == \'[\') st.push(c);\n        else {\n            if(st.empty()) return false;\n            if(c == \')\' && st.top() != \'(\') return false;\n            if(c == \'}\' && st.top() != \'{\') return false;\n            if(c == \']\' && st.top() != \'[\') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`,
      java: `public boolean isValid(String s) {\n    Deque<Character> stack = new ArrayDeque<>();\n    for (char c : s.toCharArray()) {\n        if (c == \'(\') stack.push(\')\');\n        else if (c == \'{\') stack.push(\'}\');\n        else if (c == \'[\') stack.push(\']\');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}`,
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' },
    ],
    timeComplexity: 'O(N) single pass',
    spaceComplexity: 'O(N) for the stack in worst case',
    hints: [
      'Think of Last-In-First-Out (LIFO). The most recently opened bracket must be the first one closed.',
      'A Stack data structure naturally models nested structures.',
    ],
    solutionExplanation:
      'Iterate through the string. Push matching expected closing brackets or open brackets onto a stack. When a closing bracket is encountered, verify that it matches the top of the stack.',
  },
  {
    id: 'maximum-subarray-kadane',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    difficulty: 'Medium',
    category: 'Arrays',
    companyTags: ['Amazon', 'Flipkart', 'Paytm', 'TCS Digital', 'Samsung'],
    description:
      'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'Subarray [4, -1, 2, 1] has the largest sum = 6.',
      },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5, 4, -1, 7, 8]', output: '23' },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}`,
      python: `def maxSubArray(nums: list[int]) -> int:\n    max_sum = curr_sum = nums[0]\n    for x in nums[1:]:\n        curr_sum = max(x, curr_sum + x)\n        max_sum = max(max_sum, curr_sum)\n    return max_sum`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], curr = nums[0];\n    for(int i=1; i<nums.size(); ++i) {\n        curr = max(nums[i], curr + nums[i]);\n        maxSum = max(maxSum, curr);\n    }\n    return maxSum;\n}`,
      java: `public int maxSubArray(int[] nums) {\n    int max = nums[0], curr = nums[0];\n    for(int i=1; i<nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        max = Math.max(max, curr);\n    }\n    return max;\n}`,
    },
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5, 4, -1, 7, 8]', expectedOutput: '23' },
    ],
    timeComplexity: 'O(N) linear time',
    spaceComplexity: 'O(1) constant auxiliary space',
    hints: [
      'If your running sum becomes negative, can continuing to carry it forward ever help maximize future subarray sums?',
      'At each index, decide whether to start a fresh subarray or extend the previous one.',
    ],
    solutionExplanation:
      'Kadane’s algorithm maintains two variables: currentSum and maxSum. At each element x, currentSum = max(x, currentSum + x). If adding the previous prefix degrades the total below x itself, we reset the subarray at x.',
  },
  {
    id: 'binary-search',
    title: 'Binary Search in Sorted Array',
    difficulty: 'Easy',
    category: 'Searching & Sorting',
    companyTags: ['Wipro', 'Infosys', 'Cognizant', 'Google'],
    description:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' },
    ],
    starterCode: {
      javascript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
      cpp: `int search(vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while(l <= r) {\n        int mid = l + (r - l) / 2;\n        if(nums[mid] == target) return mid;\n        if(nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
      java: `public int search(int[] nums, int target) {\n    int l = 0, r = nums.length - 1;\n    while(l <= r) {\n        int mid = l + (r - l) / 2;\n        if(nums[mid] == target) return mid;\n        if(nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
    },
    testCases: [
      { input: '[-1, 0, 3, 5, 9, 12], 9', expectedOutput: '4' },
      { input: '[-1, 0, 3, 5, 9, 12], 2', expectedOutput: '-1' },
    ],
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    hints: ['Check the middle element. If target is larger, search right half; otherwise search left half.'],
    solutionExplanation: 'Standard logarithmic divide-and-conquer on sorted intervals.',
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays',
    companyTags: ['Amazon', 'Flipkart', 'Swiggy', 'TCS Digital'],
    description:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      { input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { input: 'prices = [7, 6, 4, 3, 1]', output: '0', explanation: 'No transactions are done and max profit = 0.' },
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (const price of prices) {\n    if (price < minPrice) minPrice = price;\n    else maxProfit = Math.max(maxProfit, price - minPrice);\n  }\n  return maxProfit;\n}`,
      python: `def maxProfit(prices: list[int]) -> int:\n    min_p, max_p = float('inf'), 0\n    for p in prices:\n        if p < min_p:\n            min_p = p\n        else:\n            max_p = max(max_p, p - min_p)\n    return max_p`,
      cpp: `int maxProfit(vector<int>& prices) {\n    int minP = INT_MAX, maxProf = 0;\n    for(int p : prices) {\n        minP = min(minP, p);\n        maxProf = max(maxProf, p - minP);\n    }\n    return maxProf;\n}`,
      java: `public int maxProfit(int[] prices) {\n    int min = Integer.MAX_VALUE, max = 0;\n    for(int p : prices) {\n        if(p < min) min = p;\n        else max = Math.max(max, p - min);\n    }\n    return max;\n}`,
    },
    testCases: [
      { input: '[7, 1, 5, 3, 6, 4]', expectedOutput: '5' },
      { input: '[7, 6, 4, 3, 1]', expectedOutput: '0' },
    ],
    timeComplexity: 'O(N) single pass',
    spaceComplexity: 'O(1)',
    hints: ['Track the lowest buying price seen so far as you iterate through the list.'],
    solutionExplanation: 'Keep updating minimum price encountered. At each point, prospective profit is current price minus minimum price.',
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse a Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    companyTags: ['Microsoft', 'Amazon', 'Qualcomm', 'TCS Prime'],
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nCan you implement this iteratively and recursively?',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: 'head = [1, 2]', output: '[2, 1]' },
    ],
    starterCode: {
      javascript: `function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`,
      python: `def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while(curr) {\n        ListNode* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}`,
      java: `public ListNode reverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while(curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]' },
      { input: '[1, 2]', expectedOutput: '[2, 1]' },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Maintain three pointers: prev, curr, and next.'],
    solutionExplanation: 'Iteratively rewire each node’s next pointer to point to its predecessor (prev).',
  },
  {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Strings',
    companyTags: ['Amazon', 'Flipkart', 'Swiggy', 'Uber', 'CRED'],
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (map.has(s[right])) {\n      left = Math.max(left, map.get(s[right]) + 1);\n    }\n    map.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    char_map = {}\n    max_len = left = 0\n    for right, c in enumerate(s):\n        if c in char_map and char_map[c] >= left:\n            left = char_map[c] + 1\n        char_map[c] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    vector<int> last(256, -1);\n    int maxLen = 0, left = 0;\n    for(int r = 0; r < s.size(); ++r) {\n        if(last[s[r]] >= left) left = last[s[r]] + 1;\n        last[s[r]] = r;\n        maxLen = max(maxLen, r - left + 1);\n    }\n    return maxLen;\n}`,
      java: `public int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> map = new HashMap<>();\n    int max = 0, left = 0;\n    for(int r = 0; r < s.length(); r++) {\n        char c = s.charAt(r);\n        if(map.containsKey(c)) left = Math.max(left, map.get(c) + 1);\n        map.put(c, r);\n        max = Math.max(max, r - left + 1);\n    }\n    return max;\n}`,
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' },
    ],
    timeComplexity: 'O(N) sliding window',
    spaceComplexity: 'O(min(M, N)) character map',
    hints: ['Use the classic Two-Pointer Sliding Window approach.'],
    solutionExplanation: 'Expand the right pointer. When a duplicate is encountered inside the active window, shift the left pointer past the prior occurrence.',
  },
  {
    id: 'climbing-stairs-dp',
    title: 'Climbing Stairs (Dynamic Programming)',
    difficulty: 'Easy',
    category: 'DP',
    companyTags: ['Infosys', 'TCS', 'Accenture', 'Adobe'],
    description:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1' },
    ],
    starterCode: {
      javascript: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
      python: `def climbStairs(n: int) -> int:\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`,
      cpp: `int climbStairs(int n) {\n    if(n <= 2) return n;\n    int a = 1, b = 2;\n    for(int i = 3; i <= n; ++i) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      java: `public int climbStairs(int n) {\n    if(n <= 2) return n;\n    int a = 1, b = 2;\n    for(int i=3; i<=n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
    },
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) space optimization',
    hints: ['Notice that ways(n) = ways(n-1) + ways(n-2), exactly like the Fibonacci sequence.'],
    solutionExplanation: 'Base cases ways(1)=1, ways(2)=2. Compute iteratively without storing the entire table.',
  },
];
