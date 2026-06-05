import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import './EmployeeList.css';

const EmployeeList = () => {
  const navigate = useNavigate();

  // Core database states
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters & Layouts
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // table | grid
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals & Forms states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedEmp, setSelectedEmp] = useState(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
    teamwork: 80,
    communication: 80,
    innovation: 80,
    taskCompletion: 80,
    rewardPoints: 100
  });

  const loadEmployees = async () => {
    try {
      const res = await apiService.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      setErrorMsg('Failed to load employee records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      designation: '',
      teamwork: 80,
      communication: 80,
      innovation: 80,
      taskCompletion: 80,
      rewardPoints: 100
    });
    setIsAddModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiService.createEmployee(formData);
      setSuccessMsg(`Employee ${formData.name} added successfully!`);
      setIsAddModalOpen(false);
      loadEmployees();
    } catch (err) {
      setErrorMsg('Failed to register employee.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmp(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      teamwork: emp.teamwork,
      communication: emp.communication,
      innovation: emp.innovation,
      taskCompletion: emp.taskCompletion,
      rewardPoints: emp.rewardPoints
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiService.updateEmployee(selectedEmp.id, formData);
      setSuccessMsg(`Employee ${formData.name} profile updated!`);
      setIsEditModalOpen(false);
      loadEmployees();
    } catch (err) {
      setErrorMsg('Failed to update employee profiles.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDelete = (emp) => {
    setSelectedEmp(emp);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      await apiService.deleteEmployee(selectedEmp.id);
      setSuccessMsg(`Employee records for ${selectedEmp.name} removed.`);
      setIsDeleteModalOpen(false);
      loadEmployees();
    } catch (err) {
      setErrorMsg('Failed to remove employee.');
    } finally {
      setFormLoading(false);
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deptOptions = ['All', 'Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];

  if (loading) return <Loader text="Synchronizing employee data..." />;

  return (
    <div className="employee-list-root">
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="danger" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Directory Tools Row */}
      <div className="directory-tools-row glass-card">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or Employee ID..."
          filterElement={
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              {deptOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} {opt !== 'All' ? 'Dept' : ''}
                </option>
              ))}
            </select>
          }
        />

        <div className="directory-actions">
          {/* View Toggles */}
          <div className="view-toggle-grp">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table View"
            >
              📊
            </button>
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid Card View"
            >
              🗂️
            </button>
          </div>

          <Button onClick={handleOpenAdd} variant="primary">
            + New Employee
          </Button>
        </div>
      </div>

      {/* Main Grid/Table viewport */}
      {filteredEmployees.length === 0 ? (
        <div className="directory-empty-state glass-card">
          <span>No employees match the specified filters.</span>
        </div>
      ) : viewMode === 'table' ? (
        /* Table Mode */
        <div className="table-responsive-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="table-profile-cell">
                      <img src={emp.avatar} alt={emp.name} className="table-cell-avatar" />
                      <div className="table-cell-texts">
                        <strong className="cell-name-link" onClick={() => navigate(`/employees/${emp.id}`)}>
                          {emp.name}
                        </strong>
                        <span className="cell-sub-id">{emp.id} - {emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="dept-cell-tag">{emp.department}</span>
                  </td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className={`badge badge-${emp.status === 'Present' ? 'success' : emp.status === 'Absent' ? 'danger' : 'warning'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="rating-progress-cell">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${emp.performanceScore}%`,
                            background: emp.performanceScore > 90 ? 'var(--color-success)' : 'var(--color-primary)'
                          }}
                        ></div>
                      </div>
                      <span className="rating-percentage">{emp.performanceScore}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button className="action-view-btn" onClick={() => navigate(`/employees/${emp.id}`)} title="View profile">
                        👁️
                      </button>
                      <button className="action-edit-btn" onClick={() => handleOpenEdit(emp)} title="Edit profile">
                        ✏️
                      </button>
                      <button className="action-delete-btn" onClick={() => handleOpenDelete(emp)} title="Remove profile">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid-responsive-viewport">
          <div className="employee-cards-grid">
            {paginatedEmployees.map((emp) => (
              <div key={emp.id} className="employee-grid-card glass-card">
                <div className="grid-card-status-badge">
                  <span className={`badge badge-${emp.status === 'Present' ? 'success' : emp.status === 'Absent' ? 'danger' : 'warning'}`}>
                    {emp.status}
                  </span>
                </div>
                <div className="grid-card-top" onClick={() => navigate(`/employees/${emp.id}`)}>
                  <img src={emp.avatar} alt={emp.name} className="grid-card-avatar" />
                  <h4 className="grid-card-name">{emp.name}</h4>
                  <span className="grid-card-id">{emp.id}</span>
                </div>
                <div className="grid-card-details">
                  <div className="grid-detail-row">
                    <span>Department</span>
                    <strong>{emp.department}</strong>
                  </div>
                  <div className="grid-detail-row">
                    <span>Designation</span>
                    <strong>{emp.designation}</strong>
                  </div>
                  <div className="grid-detail-row">
                    <span>AI Risk index</span>
                    <strong className={emp.churnRisk > 15 ? 'red-text' : 'green-text'}>{emp.churnRisk}%</strong>
                  </div>
                </div>
                <div className="grid-card-actions">
                  <Button onClick={() => navigate(`/employees/${emp.id}`)} variant="outline" size="sm">
                    View
                  </Button>
                  <Button onClick={() => handleOpenEdit(emp)} variant="outline" size="sm">
                    Edit
                  </Button>
                  <button className="action-delete-btn-grid" onClick={() => handleOpenDelete(emp)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid-pagination-box glass-card">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEmployees.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* ==========================================
          MODALS SECTION (Create / Edit / Delete)
          ========================================== */}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        footer={
          <>
            <Button onClick={() => setIsAddModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreate} variant="primary" loading={formLoading}>Register</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="modal-crud-form">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleFormChange} required />
          <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleFormChange} required />
          
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" value={formData.department} onChange={handleFormChange} className="form-input">
              {deptOptions.slice(1).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <Input label="Designation / Role" name="designation" value={formData.designation} onChange={handleFormChange} placeholder="e.g. Lead Developer" required />
          
          <div className="form-row-2">
            <Input label="Teamwork KPI" type="number" min="0" max="100" name="teamwork" value={formData.teamwork} onChange={handleFormChange} />
            <Input label="Innovation KPI" type="number" min="0" max="100" name="innovation" value={formData.innovation} onChange={handleFormChange} />
          </div>
          <div className="form-row-2">
            <Input label="Communication KPI" type="number" min="0" max="100" name="communication" value={formData.communication} onChange={handleFormChange} />
            <Input label="Task Completion KPI" type="number" min="0" max="100" name="taskCompletion" value={formData.taskCompletion} onChange={handleFormChange} />
          </div>
          <Input label="Initial Reward Points" type="number" min="0" name="rewardPoints" value={formData.rewardPoints} onChange={handleFormChange} />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Profile: ${selectedEmp?.name}`}
        footer={
          <>
            <Button onClick={() => setIsEditModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleUpdate} variant="primary" loading={formLoading}>Save changes</Button>
          </>
        }
      >
        <form onSubmit={handleUpdate} className="modal-crud-form">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleFormChange} required />
          <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleFormChange} required />
          
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" value={formData.department} onChange={handleFormChange} className="form-input">
              {deptOptions.slice(1).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <Input label="Designation / Role" name="designation" value={formData.designation} onChange={handleFormChange} required />
          
          <div className="form-row-2">
            <Input label="Teamwork KPI" type="number" min="0" max="100" name="teamwork" value={formData.teamwork} onChange={handleFormChange} />
            <Input label="Innovation KPI" type="number" min="0" max="100" name="innovation" value={formData.innovation} onChange={handleFormChange} />
          </div>
          <div className="form-row-2">
            <Input label="Communication KPI" type="number" min="0" max="100" name="communication" value={formData.communication} onChange={handleFormChange} />
            <Input label="Task Completion KPI" type="number" min="0" max="100" name="taskCompletion" value={formData.taskCompletion} onChange={handleFormChange} />
          </div>
          <Input label="Reward Points Balance" type="number" min="0" name="rewardPoints" value={formData.rewardPoints} onChange={handleFormChange} />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Employee Records"
        footer={
          <>
            <Button onClick={() => setIsDeleteModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="danger" loading={formLoading}>Remove profile</Button>
          </>
        }
      >
        <p className="delete-alert-warning">
          Are you absolutely sure you want to delete employee records for <strong>{selectedEmp?.name} ({selectedEmp?.id})</strong>?
          <br /><br />
          This action will permanently purge their biographical records, face recognition index, and all performance logs from the HR Core database.
        </p>
      </Modal>
    </div>
  );
};

export default EmployeeList;
