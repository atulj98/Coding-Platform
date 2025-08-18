import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
        }

        int x = nums1.length;
        int y = nums2.length;

        int low = 0;
        int high = x;

        while (low <= high) {
        int cutx = (low + high) / 2;
        int cuty = (x + y + 1) / 2 - cutx;

        int maxleftx = (cutx == 0) ? Integer.MIN_VALUE : nums1[cutx - 1];
        int minrightx = (cutx == x) ? Integer.MAX_VALUE : nums1[cutx];

        int maxlefty = (cuty == 0) ? Integer.MIN_VALUE : nums2[cuty - 1];
        int minrighty = (cuty == y) ? Integer.MAX_VALUE : nums2[cuty];

        if (maxleftx <= minrighty && maxlefty <= minrightx) {
        if ((x + y) % 2 == 0) {
        return ((double)Math.max(maxleftx, maxlefty) + Math.min(minrightx, minrighty)) / 2;
        } else {
        return (double)Math.max(maxleftx, maxlefty);
        }
        } else if (maxleftx > minrighty) {
        high = cutx - 1;
        } else {
        low = cutx + 1;
        }
        }

        return 1.0;
    }
}

public class Main {
    // Constants for overflow checking
    public static final int INT_MAX = Integer.MAX_VALUE;
    public static final int INT_MIN = Integer.MIN_VALUE;
    
    public static int[] parseIntArray(String s) {
        if (s == null || s.equals("[]") || s.equals("null")) {
            return new int[0];
        }
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]")) s = s.substring(0, s.length() - 1);
        
        if (s.isEmpty()) return new int[0];
        
        String[] parts = s.split(",");
        int[] result = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            try {
                result[i] = Integer.parseInt(parts[i].trim());
            } catch (NumberFormatException e) {
                result[i] = 0;
            }
        }
        return result;
    }
    
    public static ListNode createLinkedList(int[] vals) {
        if (vals.length == 0) return null;
        ListNode head = new ListNode(vals[0]);
        ListNode current = head;
        for (int i = 1; i < vals.length; i++) {
            current.next = new ListNode(vals[i]);
            current = current.next;
        }
        return head;
    }
    
    public static String linkedListToString(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result.toString();
    }
    
    public static String arrayToString(int[] arr) {
        if (arr.length == 0) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(arr[i]);
        }
        sb.append("]");
        return sb.toString();
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        try {
            // Test case 1
            {
                int[] param0 = parseIntArray("[1,3]");
                int[] param1 = parseIntArray("[2]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 1 - Output: " + result + ", Expected: 2.0");
            }

            // Test case 2
            {
                int[] param0 = parseIntArray("[1,2]");
                int[] param1 = parseIntArray("[3,4]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 2 - Output: " + result + ", Expected: 2.5");
            }

            // Test case 3
            {
                int[] param0 = parseIntArray("[0,0]");
                int[] param1 = parseIntArray("[0,0]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 3 - Output: " + result + ", Expected: 0.0");
            }

            // Test case 4
            {
                int[] param0 = parseIntArray("[]");
                int[] param1 = parseIntArray("[1]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 4 - Output: " + result + ", Expected: 1.0");
            }

            // Test case 5
            {
                int[] param0 = parseIntArray("[2]");
                int[] param1 = parseIntArray("[]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 5 - Output: " + result + ", Expected: 2.0");
            }

            // Test case 6
            {
                int[] param0 = parseIntArray("[1,3,8,9,15]");
                int[] param1 = parseIntArray("[7,11,18,19,21,25]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 6 - Output: " + result + ", Expected: 11.0");
            }

            // Test case 7
            {
                int[] param0 = parseIntArray("[23,26,31,35]");
                int[] param1 = parseIntArray("[3,5,7,9,11,16]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 7 - Output: " + result + ", Expected: 13.5");
            }

            // Test case 8
            {
                int[] param0 = parseIntArray("[1,2,3,4,5]");
                int[] param1 = parseIntArray("[6,7,8,9,10]");
                var result = solution.findMedianSortedArrays(param0, param1);
                System.out.println("Test 8 - Output: " + result + ", Expected: 5.5");
            }

        } catch (Exception e) {
            System.err.println("Error during execution: " + e.getMessage());
            e.printStackTrace();
        }
    }
}