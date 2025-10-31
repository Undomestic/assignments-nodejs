
use schoolDB

db.createCollection("students")


print("--- 1. COLLECTIONS CHECK ---")
show collections

db.students.insertMany([
    {
        name: "Alice Johnson",
        student_id: 101,
        major: "Computer Science",
        gpa: 3.9
    },
    {
        name: "Bob Smith",
        student_id: 102,
        major: "Mathematics",
        gpa: 3.5
    },
    {
        name: "Charlie Brown",
        student_id: 103,
        major: "Computer Science",
        gpa: 3.1
    }
])

print("\n--- 2. ALL STUDENTS (READ) ---")
db.students.find().pretty()

print("\n--- 3. CS STUDENTS (READ with Filter) ---")
db.students.find({ major: "Computer Science" }).pretty()

db.students.updateOne(
    { name: "Alice Johnson" }, 
    { $set: { major: "Data Science" } }
)

print("\n--- 4. ALICE AFTER UPDATE (READ) ---")
db.students.findOne({ name: "Alice Johnson" })


db.students.deleteOne({ student_id: 103 })


print("\n--- 5. STUDENTS AFTER DELETE (READ) ---")
db.students.find().pretty()

