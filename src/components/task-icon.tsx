import {
  BookOpen, Bug, Briefcase, Calendar, Check, CheckCircle, Component, Cpu, Crop,
  FileAudio, FileText, Folder, GitBranch, GitPullRequest, Globe, GraduationCap,
  Image as ImageIcon, Inbox, Languages, Layout, LifeBuoy, Maximize, Mic, Music,
  Notebook, PenLine, Presentation, Repeat, Scissors, Search, Send, Table,
  Terminal, Type, Video, AudioWaveform, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Icon keys live in the database as strings so content can be edited without a
// deploy; this map is the only place they're resolved to components.
const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen, bug: Bug, briefcase: Briefcase, calendar: Calendar,
  check: Check, "check-circle": CheckCircle, component: Component, cpu: Cpu,
  crop: Crop, "file-audio": FileAudio, "file-text": FileText, folder: Folder,
  "git-branch": GitBranch, "git-pull-request": GitPullRequest, globe: Globe,
  "graduation-cap": GraduationCap, image: ImageIcon, inbox: Inbox,
  languages: Languages, layout: Layout, "life-buoy": LifeBuoy,
  maximize: Maximize, mic: Mic, music: Music, notebook: Notebook, pen: PenLine,
  presentation: Presentation, repeat: Repeat, scissors: Scissors, search: Search,
  send: Send, table: Table, terminal: Terminal, type: Type, video: Video,
  waveform: AudioWaveform, zap: Zap,
};

export function TaskIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Zap;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
