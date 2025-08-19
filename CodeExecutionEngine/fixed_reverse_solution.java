class Solution {
    public int reverse(int x) {
        int result = 0;
        
        while (x != 0) {
            int digit = x % 10;
            x /= 10;
            
            // Check for overflow before adding the digit
            if (result > Integer.MAX_VALUE / 10 || 
                (result == Integer.MAX_VALUE / 10 && digit > 7)) {
                return 0;
            }
            if (result < Integer.MIN_VALUE / 10 || 
                (result == Integer.MIN_VALUE / 10 && digit < -8)) {
                return 0;
            }
            
            result = result * 10 + digit;
        }
        
        return result;
    }
}

public class fixed_reverse_solution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Test cases
        System.out.println("123 -> " + solution.reverse(123)); // Expected: 321
        System.out.println("-123 -> " + solution.reverse(-123)); // Expected: -321
        System.out.println("120 -> " + solution.reverse(120)); // Expected: 21
        System.out.println("0 -> " + solution.reverse(0)); // Expected: 0
        System.out.println("1534236469 -> " + solution.reverse(1534236469)); // Expected: 0 (overflow)
    }
}
