class Employee {
    constructor(id, name, designation, address) {
        this.id = id;
        this.name = name;
        this.designation = designation;
        this.address = address;
    }
}


class EmployeeManagementSystem {
    constructor() {
        this.employees = [];
        this.isEmployeeFormVisible = false;
        this.isEmployeeTableViewVisible = false;
        this.isEmployeeEditViewVisible = false;
    }


    toggleEmployeeForm() {
        // Toggle visibility of employee form
        this.isEmployeeFormVisible = !this.isEmployeeFormVisible;
        const employeeForm = document.getElementById("employeeForm");
        if (this.isEmployeeFormVisible) {
            // Show employee form
            employeeForm.style.display = "block";
            document.getElementById("addEmp").innerText = "Back";
            this.hideEmployeeTableView();
            this.hideEmployeeEditView();
        } else {
            // Hide employee form
            employeeForm.style.display = "none";
            document.getElementById("addEmp").innerText = "Add Employee";
        }
    }

    submitEmployee() {
        // Retrieve employee details from form
        const id = document.getElementById("addId").value;
        const name = document.getElementById("addName").value;
        const designation = document.getElementById("addDesignation").value;
        const address = document.getElementById("addAddress").value;

        const form = document.getElementById("employeeForm");

        // Validate form input
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Validate ID field to allow only numeric values
        if (!/^\d+$/.test(id)) {
            this.displayMessage("Only numeric values allowed in ID field", 3000, "#cc00008a");
            return;
        }

        // Validate Name field to allow only alphabets
        if (!/^[A-Za-z\s]+$/.test(name)) {
            this.displayMessage("Only alphabets allowed in Name field", 3000, "#cc00008a");
            return;
        }

        // Check if ID already exists
        if (this.isIdExists(id)) {
            this.displayMessage("ID already exists!", 3000, "#cc00008a");
            return;
        }

        // Create new employee object
        const employee = new Employee(id, name, designation, address);
        this.employees.push(employee);
        form.reset();

        // Update tables
        this.updateEditTable();
        this.updateViewTable();

        // Display success message
        this.displayMessage("Details Added Successfully", 3000, "#2dc20094");
    }

    isIdExists(id) {
        return this.employees.some(employee => employee.id === id);
    }
    
    // Methods for updating view and edit tables, and toggling their visibility
    updateViewAndEditTables() {
        this.updateEditTable();
        this.updateViewTable();
    }

    updateViewTable() {
        const list = document.getElementById("employeeList");
        list.innerHTML = '';

        this.employees.forEach(employee => {
            const row = `<tr>
                            <td>${employee.id}</td>
                            <td>${employee.name}</td>
                            <td>${employee.designation}</td>
                            <td>${employee.address}</td>
                            <td><button class="btn red" id="delEmp" onclick="ems.deleteEmployee('${employee.id}')">Delete</button></td>
                        </tr>`;
            list.innerHTML += row;
        });

        if (this.employees.length > 0) {
            this.toggleEmployeeTableView();
        }
    }

    updateEditTable() {
        const list = document.getElementById("editEmployeeList");
        list.innerHTML = '';

        this.employees.forEach(employee => {
            const row = `<tr data-id="${employee.id}">
                            <td>${employee.id}</td>
                            <td>${employee.name}</td>
                            <td>${employee.designation}</td>
                            <td>${employee.address}</td>
                            <td>
                                <button class="btn blue" onclick="ems.editEmployee('${employee.id}')">Edit</button>
                            </td>
                        </tr>`;
            list.innerHTML += row;
        });

        if (this.employees.length > 0) {
            this.toggleEmployeeEditView();
        }
    }

    toggleEmployeeTableView() {
        this.isEmployeeTableViewVisible = !this.isEmployeeTableViewVisible;
        const employeeTable = document.getElementById("employeeTable");
        if (this.isEmployeeTableViewVisible) {
            employeeTable.style.display = "table";
            document.getElementById("viewEmp").innerText = "Back";
            this.hideEmployeeForm();
            this.hideEmployeeEditView();
        } else {
            employeeTable.style.display = "none";
            document.getElementById("viewEmp").innerText = "View Employees";
        }
    }

    // Method to delete an employee
    deleteEmployee(id) {
        this.employees = this.employees.filter(employee => employee.id !== id);
        this.updateEditTable();
        this.updateViewTable();
        this.displayMessage("Details Deleted Successfully", 3000, "#2dc20094");
    }

    toggleEmployeeEditView() {
        this.isEmployeeEditViewVisible = !this.isEmployeeEditViewVisible;
        const editEmployeeTable = document.getElementById("editEmployeeTable");
        if (this.isEmployeeEditViewVisible) {
            editEmployeeTable.style.display = "table";
            document.getElementById("editEmp").innerText = "Back";
            this.hideEmployeeForm();
            this.hideEmployeeTableView();
        } else {
            editEmployeeTable.style.display = "none";
            document.getElementById("editEmp").innerText = "Edit Employees";
        }
    }

    // Method to edit an employee
    editEmployee(id) {
        const employee = this.employees.find(employee => employee.id === id);
        const row = document.querySelector(`#editEmployeeList tr[data-id="${id}"]`);

        if (row) {
            // Populate editable fields with employee data
            row.innerHTML = `
                <td><input type="text" id="editId_${employee.id}" value="${employee.id}" required style="max-width: 150px;"></td>
                <td><input type="text" id="editName_${employee.id}" value="${employee.name}" required style="max-width: 150px;"></td>
                <td><input type="text" id="editDesignation_${employee.id}" value="${employee.designation}" required style="max-width: 150px;"></td>
                <td><textarea id="editAddress_${employee.id}" rows="4" required style="max-width: 150px;">${employee.address}</textarea></td>
                <td>
                    <button class="btn green" onclick="ems.updateEmployee('${employee.id}')">Update</button>
                    <button class="btn red" onclick="ems.cancelEdit('${employee.id}')">Cancel</button>
                </td> 
            `;
        }
    }

    // Method to update employee details
    updateEmployee(id) {
        const newId = document.getElementById(`editId_${id}`).value;
        const newName = document.getElementById(`editName_${id}`).value;
        const newDesignation = document.getElementById(`editDesignation_${id}`).value;
        const newAddress = document.getElementById(`editAddress_${id}`).value;

        // Validate edited fields
        const editedFields = [newId, newName, newDesignation, newAddress];
        for (const field of editedFields) {
            if (!field) {
                this.displayMessage("All fields are required.", 3000, "#cc00008a");
                return;
            }
        }

        // Validate ID field to allow only numeric values
        if (!/^\d+$/.test(newId)) {
            this.displayMessage("Only numeric values allowed in ID field", 3000, "#cc00008a");
            return;
        }

        // Validate Name field to allow only alphabets
        if (!/^[A-Za-z\s]+$/.test(newName)) {
            this.displayMessage("Only alphabets allowed in Name field", 3000, "#cc00008a");
            return;
        }

        // Check if new ID already exists
        if (this.isIdExists(newId) && newId !== id) {
            this.displayMessage("ID already exists!", 3000, "#cc00008a");
            return;
        }

        // Update employee details
        const index = this.employees.findIndex(employee => employee.id === id);
        if (index !== -1) {
            this.employees[index] = {
                id: newId,
                name: newName,
                designation: newDesignation,
                address: newAddress
            };
        }

        // Update tables
        this.updateViewTable();
        this.updateEditTable();
        // Display success message
        this.displayMessage("Details Updated Successfully", 3000, "#2dc20094");
    }

    // Method to cancel editing
    cancelEdit(id) {
        this.updateViewTable();
        this.updateEditTable();
    }

    // Method to display message
    displayMessage(message, duration, bgColor) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("display-message");
        document.body.appendChild(messageElement);
        messageElement.style.backgroundColor = bgColor;
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, duration);
    }

    // Method to hide employee form
    hideEmployeeForm() {
        const employeeForm = document.getElementById("employeeForm");
        employeeForm.style.display = "none";
        document.getElementById("addEmp").innerText = "Add Employee";
        this.isEmployeeFormVisible = false;
    }

    // Method to hide employee table view
    hideEmployeeTableView() {
        const employeeTable = document.getElementById("employeeTable");
        employeeTable.style.display = "none";
        document.getElementById("viewEmp").innerText = "View Employees";
        this.isEmployeeTableViewVisible = false;
    }

    // Method to hide employee edit view
    hideEmployeeEditView() {
        const editEmployeeTable = document.getElementById("editEmployeeTable");
        editEmployeeTable.style.display = "none";
        document.getElementById("editEmp").innerText = "Edit Employees";
        this.isEmployeeEditViewVisible = false;
    }
}

// Instantiate EmployeeManagementSystem class
const ems = new EmployeeManagementSystem();

// Event listeners for buttons
const addEmpBtn = document.getElementById("addEmp");
addEmpBtn.addEventListener("click", function(){
    ems.toggleEmployeeForm();
});

const viewEmpBtn = document.getElementById("viewEmp");
viewEmpBtn.addEventListener("click", function(){
    ems.toggleEmployeeTableView();
});

const editEmpBtn = document.getElementById("editEmp");
editEmpBtn.addEventListener("click", function(){
    ems.toggleEmployeeEditView();
});

const subEmpBtn = document.getElementById("subEmp");
subEmpBtn.addEventListener("click", function(){
    ems.submitEmployee();
});