let jobs = [];

// ADD JOB
const jobForm = document.getElementById('jobForm');
const jobTableBody = document.querySelector('#jobTable tbody');
const searchInput = document.getElementById('searchInput');
const importCSV = document.getElementById('importCSV');

jobForm.addEventListener('submit', e => {
    e.preventDefault();
    addJob({
        id: Date.now(),
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('company').value,
        status: document.getElementById('status').value,
        appliedDate: document.getElementById('appliedDate').value,
        interviewDate: document.getElementById('interviewDate').value
    });
    jobForm.reset();
});

// ADD JOB FUNCTION
function addJob(job) {
    jobs.push(job);
    renderTable();
}

// RENDER TABLE
function renderTable(filter = "") {
    jobTableBody.innerHTML = "";
    let filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(filter.toLowerCase()) ||
        j.company.toLowerCase().includes(filter.toLowerCase())
    );

    filteredJobs.forEach(job => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${job.title}</td>
            <td>${job.company}</td>
            <td><span class="status-${job.status.replace(/\s/g, '\\ ')}">${job.status}</span></td>
            <td>${job.appliedDate}</td>
            <td>${job.interviewDate || "-"}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editJob(${job.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteJob(${job.id})">Delete</button>
            </td>
        `;
        jobTableBody.appendChild(tr);
    });
}

// SEARCH
searchInput.addEventListener('input', e => renderTable(e.target.value));

// DELETE
function deleteJob(id) { jobs = jobs.filter(j => j.id !== id); renderTable(); }

// EDIT
function editJob(id) {
    const job = jobs.find(j => j.id === id);
    document.getElementById('jobTitle').value = job.title;
    document.getElementById('company').value = job.company;
    document.getElementById('status').value = job.status;
    document.getElementById('appliedDate').value = job.appliedDate;
    document.getElementById('interviewDate').value = job.interviewDate;
    deleteJob(id);
}

// EXPORT CSV
document.getElementById('exportCSV').addEventListener('click', () => {
    let csv = "Job Title,Company,Status,Applied Date,Interview Date\n";
    jobs.forEach(j => csv += `${j.title},${j.company},${j.status},${j.appliedDate},${j.interviewDate || ""}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "jobs.csv";
    link.click();
});

// EXPORT PDF
document.getElementById('exportPDF').addEventListener('click', () => {
    html2pdf().from(document.querySelector('.table-section')).set({
        margin: 10,
        filename: 'JobApplications.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
});

// IMPORT CSV
importCSV.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const lines = text.split(/\r?\n/);
        lines.shift(); // Remove header
        lines.forEach(line => {
            const [title, company, status, appliedDate, interviewDate] = line.split(',');
            if (title && company) addJob({ id: Date.now() + Math.random(), title, company, status, appliedDate, interviewDate });
        });
    };
    reader.readAsText(file);
});
