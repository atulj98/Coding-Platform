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
    public int reverse(int x) {
        int res = 0;
        boolean isNegative = x < 0;
        String strX = String.valueOf(Math.abs(x));
        StringBuilder sb = new StringBuilder(strX).reverse();

        try {
        res = Integer.parseInt(sb.toString());
        } catch (NumberFormatException e) {
        return 0;
        }

        return isNegative ? -res : res;
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
                int param0 = 123;
                var result = solution.reverse(param0);
                System.out.println("Test 1 - Output: " + result + ", Expected: 321");
            }

            // Test case 2
            {
                int param0 = -123;
                var result = solution.reverse(param0);
                System.out.println("Test 2 - Output: " + result + ", Expected: -321");
            }

            // Test case 3
            {
                int param0 = 120;
                var result = solution.reverse(param0);
                System.out.println("Test 3 - Output: " + result + ", Expected: 21");
            }

            // Test case 4
            {
                int param0 = 0;
                var result = solution.reverse(param0);
                System.out.println("Test 4 - Output: " + result + ", Expected: 0");
            }

            // Test case 5
            {
                int param0 = 1534236469;
                var result = solution.reverse(param0);
                System.out.println("Test 5 - Output: " + result + ", Expected: 0");
            }

        } catch (Exception e) {
            System.err.println("Error during execution: " + e.getMessage());
            e.printStackTrace();
        }
    }
}