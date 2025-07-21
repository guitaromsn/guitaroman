import React, { useState } from 'react';
import { formatSAR, getText, businessTexts } from '../utils/currency';
import './ModulePage.css';

interface ProjectsProps {
  locale: string;
}

const Projects: React.FC<ProjectsProps> = ({ locale }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const projects = [
    { 
      id: 'PRJ-001', 
      name: 'نظام إدارة المستودعات', 
      client: 'شركة الرياض للتجارة', 
      budget: 85000, 
      spent: 52000, 
      progress: 65, 
      status: 'active', 
      deadline: '2024-03-15',
      team: ['أحمد محمد', 'فاطمة علي', 'خالد سعد']
    },
    { 
      id: 'PRJ-002', 
      name: 'موقع تجاري إلكتروني', 
      client: 'متجر جدة الحديث', 
      budget: 45000, 
      spent: 38000, 
      progress: 85, 
      status: 'active', 
      deadline: '2024-02-28',
      team: ['سارة أحمد', 'محمد يوسف']
    },
    { 
      id: 'PRJ-003', 
      name: 'تطبيق الهاتف المحمول', 
      client: 'شركة الدمام التقنية', 
      budget: 125000, 
      spent: 125000, 
      progress: 100, 
      status: 'completed', 
      deadline: '2024-01-30',
      team: ['عبدالله ناصر', 'نورا عبدالرحمن', 'عمر الحربي']
    },
    { 
      id: 'PRJ-004', 
      name: 'نظام نقاط البيع', 
      client: 'سلسلة مطاعم الخبر', 
      budget: 65000, 
      spent: 15000, 
      progress: 25, 
      status: 'planning', 
      deadline: '2024-05-20',
      team: ['ليلى سالم', 'حسام قاسم']
    },
  ];

  const getStatusText = (status: string) => {
    const statusTexts = {
      active: { en: 'Active', ar: 'نشط' },
      planning: { en: 'Planning', ar: 'تخطيط' },
      completed: { en: 'Completed', ar: 'مكتمل' },
      on_hold: { en: 'On Hold', ar: 'متوقف' },
    };
    return getText(statusTexts[status as keyof typeof statusTexts], locale);
  };

  const getStatusClass = (status: string) => {
    const statusClasses = {
      active: 'status-success',
      planning: 'status-info',
      completed: 'status-primary',
      on_hold: 'status-warning',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-info';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'var(--success)';
    if (progress >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="module-page fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1>{getText(businessTexts.projects, locale)}</h1>
          <p className="page-subtitle">
            {locale === 'ar' 
              ? 'إدارة المشاريع والمهام' 
              : 'Manage projects and tasks'
            }
          </p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            {locale === 'ar' ? 'مشروع جديد' : 'New Project'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-project-diagram"></i>
          </div>
          <div className="stat-content">
            <h3>{activeProjects}</h3>
            <p>{locale === 'ar' ? 'مشاريع نشطة' : 'Active Projects'}</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{completedProjects}</h3>
            <p>{locale === 'ar' ? 'مشاريع مكتملة' : 'Completed Projects'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content">
            <h3>{formatSAR(totalBudget, { locale })}</h3>
            <p>{locale === 'ar' ? 'إجمالي الميزانية' : 'Total Budget'}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{formatSAR(totalSpent, { locale })}</h3>
            <p>{locale === 'ar' ? 'إجمالي المصروف' : 'Total Spent'}</p>
          </div>
        </div>
      </div>

      {/* Projects Content */}
      {viewMode === 'grid' ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p className="project-client">{project.client}</p>
                  <span className="project-id">{project.id}</span>
                </div>
                <span className={`status-badge ${getStatusClass(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              <div className="project-progress">
                <div className="progress-header">
                  <span>{locale === 'ar' ? 'التقدم' : 'Progress'}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${project.progress}%`,
                      backgroundColor: getProgressColor(project.progress)
                    }}
                  ></div>
                </div>
              </div>

              <div className="project-budget">
                <div className="budget-item">
                  <span className="budget-label">{locale === 'ar' ? 'الميزانية:' : 'Budget:'}</span>
                  <span className="budget-value">{formatSAR(project.budget, { locale })}</span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">{locale === 'ar' ? 'المصروف:' : 'Spent:'}</span>
                  <span className="budget-value">{formatSAR(project.spent, { locale })}</span>
                </div>
              </div>

              <div className="project-team">
                <span className="team-label">{locale === 'ar' ? 'الفريق:' : 'Team:'}</span>
                <div className="team-members">
                  {project.team.map((member, index) => (
                    <span key={index} className="team-member">{member}</span>
                  ))}
                </div>
              </div>

              <div className="project-footer">
                <div className="deadline">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(project.deadline).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="project-actions">
                  <button className="action-btn" title={locale === 'ar' ? 'عرض' : 'View'}>
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn" title={locale === 'ar' ? 'تعديل' : 'Edit'}>
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'رقم المشروع' : 'Project ID'}</th>
                  <th>{locale === 'ar' ? 'اسم المشروع' : 'Project Name'}</th>
                  <th>{locale === 'ar' ? 'العميل' : 'Client'}</th>
                  <th>{locale === 'ar' ? 'الميزانية' : 'Budget'}</th>
                  <th>{locale === 'ar' ? 'المصروف' : 'Spent'}</th>
                  <th>{locale === 'ar' ? 'التقدم' : 'Progress'}</th>
                  <th>{getText(businessTexts.status, locale)}</th>
                  <th>{locale === 'ar' ? 'الموعد النهائي' : 'Deadline'}</th>
                  <th>{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="project-id">{project.id}</td>
                    <td className="project-name">{project.name}</td>
                    <td>{project.client}</td>
                    <td className="amount">{formatSAR(project.budget, { locale })}</td>
                    <td className="amount">{formatSAR(project.spent, { locale })}</td>
                    <td>
                      <div className="progress-cell">
                        <div className="mini-progress-bar">
                          <div 
                            className="mini-progress-fill" 
                            style={{ 
                              width: `${project.progress}%`,
                              backgroundColor: getProgressColor(project.progress)
                            }}
                          ></div>
                        </div>
                        <span>{project.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td>{new Date(project.deadline).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title={locale === 'ar' ? 'عرض' : 'View'}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn edit" title={locale === 'ar' ? 'تعديل' : 'Edit'}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;