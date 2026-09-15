import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { User } from './models/User.js';
import { Program } from './models/Program.js';

async function seed() {
  try {
    console.log('🌱 Starting CodeNest seed script...');
    await connectDatabase();

    const demoEmail = 'alex@codenest.dev';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('codenest123', salt);

      user = await User.create({
        email: demoEmail,
        passwordHash,
        name: 'Alex Rivera',
        college: 'Dept of Computer Science & Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'student',
      });
      console.log(`Created demo user: ${demoEmail} (password: codenest123)`);
    } else {
      console.log(`Using existing user: ${demoEmail}`);
    }

    // Clear existing programs for clean seed
    await Program.deleteMany({ userId: user._id });

    const samplePrograms = [
      {
        userId: user._id,
        title: 'Binary Search Implementation',
        subject: 'DSA',
        language: 'cpp',
        question: 'Write an efficient iterative and recursive C++ function to perform Binary Search on a sorted integer array. Return the index of the target element, or -1 if not found. What is the time complexity?',
        code: `#include <iostream>
#include <vector>

using namespace std;

// Iterative Binary Search
// Time Complexity: O(log n), Space Complexity: O(1)
int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        // Prevents integer overflow compared to (left + right) / 2
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1; // Target element not found
}

int main() {
    vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;

    int result = binarySearch(numbers, target);
    if (result != -1) {
        cout << "Element found at index: " << result << endl;
    } else {
        cout << "Element not present in array." << endl;
    }

    return 0;
}`,
        notes: '- Crucial: Always use `left + (right - left) / 2` to prevent potential 32-bit integer overflow.\n- Array must already be sorted before calling.\n- Space complexity: O(1) iterative vs O(log n) recursive due to call stack.',
        tags: ['dsa', 'searching', 'algorithms', 'cpp', 'arrays'],
        isFavorite: true,
      },
      {
        userId: user._id,
        title: 'Matrix Multiplication with Validation',
        subject: 'C Programming',
        language: 'c',
        question: 'Write a C program to multiply two matrices of order r1 x c1 and r2 x c2. Validate if multiplication is possible (c1 == r2). Display the resultant matrix formatted cleanly.',
        code: `#include <stdio.h>
#include <stdlib.h>

#define MAX 10

void multiplyMatrices(int first[][MAX], int second[][MAX], int mult[][MAX], int r1, int c1, int r2, int c2) {
    // Initializing elements of matrix mult to 0.
    for (int i = 0; i < r1; ++i) {
        for (int j = 0; j < c2; ++j) {
            mult[i][j] = 0;
        }
    }

    // Multiplying matrix first and second and storing in mult.
    for (int i = 0; i < r1; ++i) {
        for (int j = 0; j < c2; ++j) {
            for (int k = 0; k < c1; ++k) {
                mult[i][j] += first[i][k] * second[k][j];
            }
        }
    }
}

int main() {
    int r1 = 2, c1 = 3, r2 = 3, c2 = 2;
    int first[MAX][MAX] = {{1, 2, 3}, {4, 5, 6}};
    int second[MAX][MAX] = {{7, 8}, {9, 1}, {2, 3}};
    int result[MAX][MAX];

    if (c1 != r2) {
        printf("Error: Matrix multiplication not possible. Column of 1st != Row of 2nd.\\n");
        return 1;
    }

    multiplyMatrices(first, second, result, r1, c1, r2, c2);

    printf("Resultant Matrix (%dx%d):\\n", r1, c2);
    for (int i = 0; i < r1; ++i) {
        for (int j = 0; j < c2; ++j) {
            printf("%d\\t", result[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`,
        notes: 'Lab Exam tip: Remember that matrix multiplication has O(n^3) complexity. For larger matrices, consider Strassen algorithm.',
        tags: ['c', 'matrix', 'arrays', 'math'],
        isFavorite: false,
      },
      {
        userId: user._id,
        title: 'Singly Linked List Implementation (CRUD)',
        subject: 'C Programming',
        language: 'c',
        question: 'Implement a singly linked list in C with functions to insert at head, insert at tail, delete by value, and print list contents.',
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    if (!newNode) {
        printf("Memory allocation failed\\n");
        exit(1);
    }
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

void insertAtHead(struct Node** head, int value) {
    struct Node* newNode = createNode(value);
    newNode->next = *head;
    *head = newNode;
}

void printList(struct Node* head) {
    struct Node* curr = head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    insertAtHead(&head, 30);
    insertAtHead(&head, 20);
    insertAtHead(&head, 10);

    printf("Linked List: ");
    printList(head);

    return 0;
}`,
        notes: 'Always check if `malloc` returns NULL. Remember to free memory in production code.',
        tags: ['c', 'pointers', 'linked-list', 'data-structures'],
        isFavorite: true,
      },
      {
        userId: user._id,
        title: 'Student Management Record System',
        subject: 'Java',
        language: 'java',
        question: 'Design an Object-Oriented Java program with a Student class containing id, name, gpa, and department. Provide methods to calculate letter grade and print transcripts.',
        code: `import java.util.ArrayList;
import java.util.List;

public class StudentManagement {
    public static class Student {
        private String id;
        private String name;
        private double gpa;
        private String department;

        public Student(String id, String name, double gpa, String department) {
            this.id = id;
            this.name = name;
            this.gpa = gpa;
            this.department = department;
        }

        public String getLetterGrade() {
            if (gpa >= 3.8) return "A+";
            if (gpa >= 3.5) return "A";
            if (gpa >= 3.0) return "B";
            if (gpa >= 2.0) return "C";
            return "F";
        }

        public void printRecord() {
            System.out.printf("[%s] %s | Dept: %s | GPA: %.2f (%s)%n",
                id, name, department, gpa, getLetterGrade());
        }
    }

    public static void main(String[] args) {
        List<Student> students = new ArrayList<>();
        students.add(new Student("CS201", "Alex Rivera", 3.92, "Computer Science"));
        students.add(new Student("CS202", "Maya Chen", 3.75, "Computer Science"));
        students.add(new Student("EE105", "Jordan Lee", 3.40, "Electrical Eng"));

        System.out.println("=== CodeNest Student Directory ===");
        for (Student s : students) {
            s.printRecord();
        }
    }
}`,
        notes: 'Good demonstration of encapsulation, OOP principles, and formatted string output.',
        tags: ['java', 'oop', 'collections', 'classes'],
        isFavorite: true,
      },
      {
        userId: user._id,
        title: 'Advanced Department Enrollment & Grade SQL Analysis',
        subject: 'DBMS',
        language: 'sql',
        question: 'Write SQL queries using JOIN, GROUP BY, and HAVING to list all departments with more than 5 enrolled students, their average GPA, and highest grade recorded.',
        code: `-- Schema query for department grade analysis
SELECT 
    d.department_id,
    d.department_name,
    COUNT(s.student_id) AS total_enrolled,
    ROUND(AVG(e.grade_points), 2) AS avg_department_gpa,
    MAX(e.grade_points) AS top_grade
FROM 
    departments d
INNER JOIN 
    students s ON d.department_id = s.department_id
INNER JOIN 
    enrollments e ON s.student_id = e.student_id
WHERE 
    e.semester = 'Fall 2026'
GROUP BY 
    d.department_id, 
    d.department_name
HAVING 
    COUNT(s.student_id) >= 5
ORDER BY 
    avg_department_gpa DESC;`,
        notes: 'Check indexes on `department_id` and `student_id` foreign keys to ensure fast index scan on large student bodies.',
        tags: ['sql', 'dbms', 'aggregations', 'joins'],
        isFavorite: true,
      },
      {
        userId: user._id,
        title: 'Dijkstra Shortest Path with Priority Queue',
        subject: 'DSA',
        language: 'python',
        question: 'Implement Dijkstra algorithm in Python using heapq to find the shortest distance from a start vertex to all other vertices in a weighted graph with non-negative edge weights.',
        code: `import heapq
from typing import Dict, List, Tuple

def dijkstra(graph: Dict[str, List[Tuple[str, int]]], start_node: str) -> Dict[str, float]:
    """
    Computes shortest path from start_node to all reachable nodes.
    Time complexity: O((V + E) log V)
    """
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start_node] = 0
    pq = [(0, start_node)]

    while pq:
        current_distance, current_vertex = heapq.heappop(pq)

        # Nodes can be added multiple times; process only the shortest
        if current_distance > distances[current_vertex]:
            continue

        for neighbor, weight in graph[current_vertex]:
            distance = current_distance + weight

            # Found a shorter path to neighbor
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances

if __name__ == "__main__":
    network = {
        'A': [('B', 4), ('C', 2)],
        'B': [('A', 4), ('C', 1), ('D', 5)],
        'C': [('A', 2), ('B', 1), ('D', 8), ('E', 10)],
        'D': [('B', 5), ('C', 8), ('E', 2)],
        'E': [('C', 10), ('D', 2)]
    }

    result = dijkstra(network, 'A')
    print("Shortest distances from Node A:")
    for node, dist in sorted(result.items()):
        print(f"  To {node}: {dist}")
`,
        notes: 'Remember: Dijkstra fails with negative edge weights. Use Bellman-Ford algorithm in that case.',
        tags: ['python', 'dsa', 'graphs', 'greedy', 'heapq'],
        isFavorite: false,
      },
    ];

    await Program.insertMany(samplePrograms);
    console.log(`✅ Successfully seeded ${samplePrograms.length} college programs for user: ${demoEmail}`);

    await disconnectDatabase();
    console.log('🌱 Seed complete.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
