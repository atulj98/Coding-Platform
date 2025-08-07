#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <climits>
#include <algorithm>
#include <stdexcept>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// Helper functions for parsing and conversion
vector<int> parseIntArray(const string& s) {
    vector<int> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    string cleaned = s;
    if (cleaned.front() == '[') cleaned = cleaned.substr(1);
    if (cleaned.back() == ']') cleaned = cleaned.substr(0, cleaned.length() - 1);
    
    if (cleaned.empty()) return result;
    
    stringstream ss(cleaned);
    string item;
    while (getline(ss, item, ',')) {
        if (!item.empty()) {
            try {
                result.push_back(stoi(item));
            } catch (const exception& e) {
                cerr << "Warning: Could not parse integer: " << item << endl;
            }
        }
    }
    return result;
}

vector<string> parseStringArray(const string& s) {
    vector<string> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    string cleaned = s;
    if (cleaned.front() == '[') cleaned = cleaned.substr(1);
    if (cleaned.back() == ']') cleaned = cleaned.substr(0, cleaned.length() - 1);
    
    if (cleaned.empty()) return result;
    
    stringstream ss(cleaned);
    string item;
    while (getline(ss, item, ',')) {
        if (!item.empty()) {
            // Remove quotes if present
            if (item.front() == '"' && item.back() == '"') {
                item = item.substr(1, item.length() - 2);
            }
            result.push_back(item);
        }
    }
    return result;
}

ListNode* createLinkedList(const vector<int>& vals) {
    if (vals.empty()) return nullptr;
    ListNode* head = new ListNode(vals[0]);
    ListNode* current = head;
    for (size_t i = 1; i < vals.size(); i++) {
        current->next = new ListNode(vals[i]);
        current = current->next;
    }
    return head;
}

vector<int> linkedListToVector(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

string vectorToString(const vector<int>& v) {
    if (v.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) result += ",";
        result += to_string(v[i]);
    }
    result += "]";
    return result;
}

string vectorToString(const vector<string>& v) {
    if (v.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) result += ",";
        result += '"' + v[i] + '"';
    }
    result += "]";
    return result;
}

// User code
double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int x = nums1.size();
        int y = nums2.size();
        
        int low = 0;
        int high = x;
        
        while (low <= high) {
            int cutx = (low + high) / 2;
            int cuty = (x + y + 1) / 2 - cutx;
            
            int maxleftx = (cutx == 0) ? INT_MIN : nums1[cutx - 1];
            int minrightx = (cutx == x) ? INT_MAX : nums1[cutx];
            
            int maxlefty = (cuty == 0) ? INT_MIN : nums2[cuty - 1];
            int minrighty = (cuty == y) ? INT_MAX : nums2[cuty];
            
            if (maxleftx <= minrighty && maxlefty <= minrightx) {
                if ((x + y) % 2 == 0) {
                    return ((double)max(maxleftx, maxlefty) + min(minrightx, minrighty)) / 2;
                } else {
                    return (double)max(maxleftx, maxlefty);
                }
            } else if (maxleftx > minrighty) {
                high = cutx - 1;
            } else {
                low = cutx + 1;
            }
        }
        
        return 1.0;
}

int main() {
    try {
        // Test case 1
        vector<int> arg0_0 = parseIntArray("[1,3]
[2]");
        vector<int> arg0_1 = parseIntArray("");
        auto result0 = findMedianSortedArrays(arg0_0, arg0_1);
        cout << "Test 1 - Output: " << result0 << ", Expected: 2.0" << endl;

        // Test case 2
        vector<int> arg1_0 = parseIntArray("[1,2]
[3,4]");
        vector<int> arg1_1 = parseIntArray("");
        auto result1 = findMedianSortedArrays(arg1_0, arg1_1);
        cout << "Test 2 - Output: " << result1 << ", Expected: 2.5" << endl;

        // Test case 3
        vector<int> arg2_0 = parseIntArray("[0,0]
[0,0]");
        vector<int> arg2_1 = parseIntArray("");
        auto result2 = findMedianSortedArrays(arg2_0, arg2_1);
        cout << "Test 3 - Output: " << result2 << ", Expected: 0.0" << endl;

        // Test case 4
        vector<int> arg3_0 = parseIntArray("[]
[1]");
        vector<int> arg3_1 = parseIntArray("");
        auto result3 = findMedianSortedArrays(arg3_0, arg3_1);
        cout << "Test 4 - Output: " << result3 << ", Expected: 1.0" << endl;

        // Test case 5
        vector<int> arg4_0 = parseIntArray("[2]
[]");
        vector<int> arg4_1 = parseIntArray("");
        auto result4 = findMedianSortedArrays(arg4_0, arg4_1);
        cout << "Test 5 - Output: " << result4 << ", Expected: 2.0" << endl;

        // Test case 6
        vector<int> arg5_0 = parseIntArray("[1,3,8,9,15]
[7,11,18,19,21,25]");
        vector<int> arg5_1 = parseIntArray("");
        auto result5 = findMedianSortedArrays(arg5_0, arg5_1);
        cout << "Test 6 - Output: " << result5 << ", Expected: 11.0" << endl;

        // Test case 7
        vector<int> arg6_0 = parseIntArray("[23,26,31,35]
[3,5,7,9,11,16]");
        vector<int> arg6_1 = parseIntArray("");
        auto result6 = findMedianSortedArrays(arg6_0, arg6_1);
        cout << "Test 7 - Output: " << result6 << ", Expected: 13.5" << endl;

        // Test case 8
        vector<int> arg7_0 = parseIntArray("[1,2,3,4,5]
[6,7,8,9,10]");
        vector<int> arg7_1 = parseIntArray("");
        auto result7 = findMedianSortedArrays(arg7_0, arg7_1);
        cout << "Test 8 - Output: " << result7 << ", Expected: 5.5" << endl;

    } catch (const exception& e) {
        cerr << "Error during execution: " << e.what() << endl;
        return 1;
    }
    return 0;
}