export interface App { id: number; name: string; url: string; desc: string; tags: string[] }
export const apps: App[] = [
  {
    id: 1,
    name: 'Uptime Kuma',
    url: 'https://uptime.janmejay.info',
    desc: 'Self-hosted uptime monitoring with status pages and alerting for service health.',
    tags: ['Monitoring', 'Status Pages', 'Alerts'],
  },
  {
    id: 2,
    name: 'Grafana',
    url: 'https://grafana.janmejay.info',
    desc: 'Dashboards and observability panels for metrics, logs, and system trends at a glance.',
    tags: ['Dashboards', 'Metrics', 'Observability'],
  },
  {
    id: 3,
    name: 'Drive',
    url: 'https://drive.janmejay.info',
    desc: 'Central file storage and sharing workspace for personal and project assets.',
    tags: ['Storage', 'File Sharing', 'Cloud'],
  },
  {
    id: 3,
    name: 'PDF Editor',
    url: 'https://pdf.janmejay.info',
    desc: 'Browser-based PDF tools for merge, split, convert, and document workflows.',
    tags: ['PDF Tools', 'Document Workflow', 'Web App'],
  },
];