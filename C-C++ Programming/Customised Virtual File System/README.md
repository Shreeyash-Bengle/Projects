CUSTOMIZED VIRTUAL FILE SYSTEM(CVFS)

TECHNOLOGY : C Programming

PROJECT OVERVIEW
This project is a custom implementation of a Virtual File System (VFS) that simulates the core functionality of the Linux file system. It is built entirely in C, with its own custom shell to interact with the virtual environment. The project provides a practical understanding of system calls, file handling, memory management, and OS internals.

KEY FEATURES

1. Custom Shell Interface
   • Provides Linux-like commands for file operations (create, open, read, write, delete, Is, etc.).

2. System Call Simulation
   • Implements core Linux file system system calls (open, read, write, Iseek, close, rm, etc.) using C.

3. File System Data Structures
   • Incore Table Inodes
   • File Table
   • UAREA (User Area)
   • User File Descriptor Table

4. Platform Independent
   • Allows system-level file handling functionalities of Linux to be used on any operating system platform.

5. Database-like Functionality
   • Provides a customised database management layer with structured file handling.

LEARNING OUTCOMES
• Deep understanding of Linux File System internals.
• Practical knowledge of data structures used in OS (inode, file tables, UAREA).
• Strong grasp of system programming in C.
• Hands-on with shell design & command interpreter.
• Application of low-level logic building for OS-like environments.

Example Usage

$./Myexe
Marvellous CVFS> create Demo.txt
Marvellous CVFS> write Demo.txt "Jay Ganesh"
Marvellous CVFS> read Demo.txt
Jai Ganesh
Marvellous CVFS> Is
Demo.txt
Marvellous CVFS> rm Demo.txt
Marvellous CVFS> exit

PLATFORM REQUIRED : This Project is Platform Independent. It can run on any  
 platform(Windows/Linux/MacOs).

HARDWARE REQUIREMENTS: CPU- Any modern processor (e.g., Intel, AMD) will
suffice.  
 RAM: A small amount of RAM (e.g., a few hundred megabytes) is generally
sufficient for most use cases.  
Storage: Minimal disk space is required to store the source code and any
compiled binaries.
