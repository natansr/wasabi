import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../components/home/HomePage';
import { ProjectList } from '../components/project/ProjectList';
import { ProjectWizard } from '../components/project/ProjectWizard';
import { SettingsPage } from '../components/settings/SettingsPage';

export function AppRoutes() {
  return <Routes><Route path="/" element={<HomePage />} /><Route path="/projects" element={<ProjectList />} /><Route path="/projects/new" element={<ProjectWizard />} /><Route path="/projects/:projectId" element={<ProjectWizard />} /><Route path="/settings" element={<SettingsPage />} /><Route path="*" element={<HomePage />} /></Routes>;
}
