let userForm=document.getElementById("user-form");
const dateInput = document.getElementById("dob");
const currentDate = new Date();
const minDate = new Date();
const maxDate = new Date();


minDate.setFullYear(currentDate.getFullYear() - 55);

maxDate.setFullYear(currentDate.getFullYear() - 18);
dateInput.setAttribute("min", minDate.toISOString().split('T')[0]);
dateInput.setAttribute("max", maxDate.toISOString().split('T')[0]);


const retrieveEntries = () => {
    let entries=localStorage.getItem("user-entries");
    if(entries){
        entries=JSON.parse(entries);
    }
    else{
        entries=[];
    }
    return entries;
}
let userEntries= retrieveEntries();
const displayEntries=()=>{
    const entries=retrieveEntries();


    const tableEntries=entries.map((entry)=>{
        const nameCell=`<td class='border px-4 py-2 text-center'>${entry.name}</td>`;
        const emailCell=`<td class='border px-4 py-2 text-center'>${entry.email}</td>`;
        const passwordCell=`<td class='border px-4 py-2 text-center'>${entry.password}</td>`;        
        const dobCell=`<td class='border px-4 py-2 text-center'>${entry.dob}</td>`;
        const acceptTermsCell=`<td class='border px-4 py-2 text-center'>${entry.accepetdTermsAndCondtions}</td>`;

        const row=`<tr>${nameCell}${emailCell}${passwordCell}${dobCell}${acceptTermsCell}</tr>`;
        return row
    }).join("\n");
    
    const table=`<table class="table-auto w-full"><tr>
    <th class="border px-4 py-2">Name</th>
    <th class="border px-4 py-2">Email</th>
    <th class="border px-4 py-2">Password</th>
    <th class="border px-4 py-2">Dob</th>
    <th class="border px-4 py-2">Accepted Terms?</th>
    </tr>${tableEntries}</table>`;
    let details=document.getElementById("user-entries");
    details.innerHTML=table;
}     

const saveUserForm=(event)=>{
    event.preventDefault();
    const name= document.getElementById("name").value;
    const email= document.getElementById("email").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        
        return;
    }

    const password= document.getElementById("password").value;
    const dob= document.getElementById("dob").value;


    const birthDate = new Date(dob);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 18 || age > 55) {
        alert("Age must be between 18 and 55 years");
        return;
    }

    const accepetdTermsAndCondtions= document.getElementById("acceptterms").checked; 
    const entry={
        name,
        email,
        password,
        dob,
        accepetdTermsAndCondtions
    };
    userEntries.push(entry);
    localStorage.setItem("user-entries",JSON.stringify(userEntries));
    displayEntries();
}



userForm.addEventListener("submit", saveUserForm)
displayEntries();