import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Settings, 
  Search, 
  Filter,
  MoreVertical,
  Bot,
  Mail,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Monitor,
  Wifi,
  WifiOff,
  AlertCircle,
  Building2,
  Send,
  ArrowRightLeft,
  Shield,
  FileSignature,
  Check,
  X,
  Link as LinkIcon,
  Database,
  Phone,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import allseeLogo from 'figma:asset/624db3eead59bc031d79bf3bba2df25d272cf5e2.png';

// --- Types ---

type DeviceStatus = 'Online' | 'Offline' | 'Error';
type HardwareType = '43in Screen' | '37in Stretch' | '4m LED Header' | '2M LED Header' | '600 Header';
type OrgRole = 'Parent' | 'Child';

interface Organization {
  id: string;
  name: string;
  role: OrgRole;
  location: string;
}

interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  contentName: string;
  serialNumber: string;
  expiryDate: string;
  location: string;
  orgId: string;
  hardwareType: HardwareType;
  lastHeartbeat?: string;
  notes?: string;
}

interface RenewalRequest {
  id: string;
  deviceId: string;
  childOrgId: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'processed';
  digitalHash: string;
  smartContractRef: string;
  aiRiskSummary: string;
  communicationLog: { stage: string; date: string; status: 'completed' | 'current' | 'pending'; icon: any }[];
}

// --- Mock Data ---

const ORGANIZATIONS: Organization[] = [
  { id: 'org_parent', name: 'Allsee Technologies', role: 'Parent', location: 'HQ' },
  { id: 'org_child_bham', name: 'Allsee Birmingham', role: 'Child', location: 'Birmingham' },
];

const DEVICES: Device[] = [
  { id: 'dev_001', name: 'London Office Screen 1', status: 'Online', contentName: 'Mixed Zyn', serialNumber: '00000101', expiryDate: '2028-01-31', location: 'London', orgId: 'org_parent', hardwareType: '43in Screen' },
  { id: 'dev_002', name: 'London Office Screen 2', status: 'Online', contentName: 'Find Your Zyn', serialNumber: '00000102', expiryDate: '2029-01-31', location: 'London', orgId: 'org_parent', hardwareType: '37in Stretch' },
  { id: 'dev_003', name: 'Manchester Office Screen', status: 'Online', contentName: 'IQOS Your Choice', serialNumber: '00000103', expiryDate: '2030-01-31', location: 'Manchester', orgId: 'org_parent', hardwareType: '4m LED Header' },
  { id: 'dev_004', name: 'Leeds Office Screen', status: 'Online', contentName: 'IQOS Tune Out', serialNumber: '00000104', expiryDate: '2031-01-31', location: 'Leeds', orgId: 'org_parent', hardwareType: '43in Screen' },
  { id: 'dev_005', name: 'Bristol Office Screen', status: 'Online', contentName: 'Weekly Deals', serialNumber: '00000105', expiryDate: '2027-01-31', location: 'Bristol', orgId: 'org_parent', hardwareType: '2M LED Header' },
  { id: 'dev_006', name: 'Newcastle Office Screen', status: 'Online', contentName: 'Featured Products', serialNumber: '00000106', expiryDate: '2028-01-31', location: 'Newcastle', orgId: 'org_parent', hardwareType: '43in Screen' },
  { id: 'dev_007', name: 'Nottingham Office Screen', status: 'Online', contentName: 'Brand Spotlight', serialNumber: '00000107', expiryDate: '2029-01-31', location: 'Nottingham', orgId: 'org_parent', hardwareType: '37in Stretch' },
  { id: 'dev_008', name: 'Cardiff Office Screen', status: 'Online', contentName: 'Veev Perspective', serialNumber: '00000108', expiryDate: '2030-01-31', location: 'Cardiff', orgId: 'org_parent', hardwareType: '4m LED Header' },
  { id: 'dev_009', name: 'Birmingham City Centre Screen 1', status: 'Online', contentName: 'Limited Edition', serialNumber: '00000201', expiryDate: '2026-03-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '37in Stretch' }, 
  { id: 'dev_010', name: 'Birmingham City Centre Screen 2', status: 'Online', contentName: 'Clearance Event', serialNumber: '00000202', expiryDate: '2029-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '4m LED Header' },
  { id: 'dev_011', name: 'Birmingham Retail Park Screen 1', status: 'Online', contentName: 'Flash Sale', serialNumber: '00000203', expiryDate: '2030-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '43in Screen' },
  { id: 'dev_012', name: 'Birmingham Retail Park Screen 2', status: 'Online', contentName: 'Weekend Special', serialNumber: '00000204', expiryDate: '2031-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '2M LED Header' },
  { id: 'dev_013', name: 'Birmingham Shopping Centre Screen', status: 'Online', contentName: 'Monthly Highlights', serialNumber: '00000205', expiryDate: '2027-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '600 Header' },
  { id: 'dev_014', name: 'Birmingham High Street Screen 1', status: 'Online', contentName: 'Product Launch', serialNumber: '00000206', expiryDate: '2028-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '37in Stretch' },
  { id: 'dev_015', name: 'Birmingham High Street Screen 2', status: 'Error', contentName: 'Spring Collection', serialNumber: '00000207', expiryDate: '2029-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '4M LED Header' },
  { id: 'dev_016', name: 'Birmingham Outlet Screen', status: 'Offline', contentName: 'Autumn Promo', serialNumber: '00000208', expiryDate: '2030-01-31', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '43in Screen', lastHeartbeat: '3:23 PM, 31/01/2026', notes: 'Media publishing is processing, the device has not yet downloaded the media.' },
  { id: 'dev_017', name: 'Birmingham Reception Display', status: 'Online', contentName: 'Welcome Messaging', serialNumber: '00000209', expiryDate: '2026-02-28', location: 'Birmingham', orgId: 'org_child_bham', hardwareType: '43in Screen' },
];

const INITIAL_REQUESTS: RenewalRequest[] = [
  { 
    id: 'req_1', 
    deviceId: 'dev_009', 
    childOrgId: 'org_child_bham', 
    requestedBy: 'Birmingham Admin', 
    date: '2026-01-29', 
    status: 'pending',
    digitalHash: '0x7f9...a2b',
    smartContractRef: 'Allsee_Sub_v2',
    aiRiskSummary: 'Critical Service Interruption Risk. This device is the primary display for the Birmingham City Centre flagship store. Historical data shows similar expirations led to 12% revenue drop in store. Child admin has escalated this request after receiving 3 automated warnings.',
    communicationLog: [
      { stage: 'Email Warning', date: 'Jan 10', status: 'completed', icon: Mail },
      { stage: 'Phone Follow-up', date: 'Jan 15', status: 'completed', icon: Phone },
      { stage: 'CMS Popup', date: 'Jan 28', status: 'completed', icon: MessageSquare },
      { stage: 'Auto-Renew', date: 'Feb 15', status: 'pending', icon: RefreshCw },
    ]
  }
];

// --- Helpers ---

const getStatusColor = (status: DeviceStatus) => {
  switch (status) {
    case 'Online': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Offline': return 'text-zinc-500 bg-zinc-900 border-zinc-700';
    case 'Error': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    default: return 'text-zinc-400 bg-zinc-900 border-zinc-700';
  }
};

const getStatusIcon = (status: DeviceStatus) => {
  switch (status) {
    case 'Online': return <Wifi size={14} />;
    case 'Offline': return <WifiOff size={14} />;
    case 'Error': return <AlertCircle size={14} />;
  }
};

const getExpiryStatus = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date('2026-01-31'); // Simulation date
  const monthsUntilExpiry = (date.getFullYear() - now.getFullYear()) * 12 + (date.getMonth() - now.getMonth());
  
  if (monthsUntilExpiry < 0) return { label: 'Expired', color: 'text-rose-400 bg-rose-500/10', urgent: true };
  if (monthsUntilExpiry <= 2) return { label: 'Expiring Soon', color: 'text-amber-400 bg-amber-500/10', urgent: true };
  if (monthsUntilExpiry <= 12) return { label: '< 1 Year', color: 'text-[#d6ff3f] bg-[#d6ff3f]/10', urgent: false };
  return { label: 'Healthy', color: 'text-zinc-400 bg-zinc-900', urgent: false };
};

// --- Components ---

const Sidebar = ({ currentOrg, onSwitchOrg }: { currentOrg: Organization, onSwitchOrg: (id: string) => void }) => (
  <div className="w-64 bg-black text-zinc-400 h-screen flex flex-col border-r border-zinc-800 shrink-0">
    <div className="p-6 mb-2">
      <img src={allseeLogo} alt="Allsee Logo" className="h-16 w-auto mb-2" />
      <span className="text-[10px] text-[#d6ff3f] uppercase tracking-wider font-semibold block pl-1">Renewal Centre</span>
    </div>

    {/* Org Switcher for Demo Purpose */}
    <div className="px-4 mb-6">
      <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Current View</p>
        <div className="relative">
          <select 
            value={currentOrg.id}
            onChange={(e) => onSwitchOrg(e.target.value)}
            className="w-full bg-black text-zinc-200 text-sm rounded p-2 border border-zinc-700 appearance-none cursor-pointer focus:ring-2 focus:ring-[#d6ff3f] focus:outline-none focus:border-[#d6ff3f] transition-all"
          >
            {ORGANIZATIONS.map(org => (
              <option key={org.id} value={org.id}>{org.name} ({org.role})</option>
            ))}
          </select>
          <ArrowRightLeft className="absolute right-2 top-2.5 text-zinc-500 pointer-events-none" size={14} />
        </div>
      </div>
    </div>
    
    <nav className="flex-1 px-4 space-y-1">
      <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
      <SidebarItem icon={<Monitor size={18} />} label="Devices" />
      <SidebarItem icon={<Building2 size={18} />} label="Sites" />
      <div className="pt-4 pb-2">
        <p className="px-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Administration</p>
      </div>
      {currentOrg.role === 'Parent' ? (
         <>
          <SidebarItem icon={<CreditCard size={18} />} label="Billing & Renewals" badge="2" />
          <SidebarItem icon={<Users size={18} />} label="Users" />
         </>
      ) : (
          <SidebarItem icon={<FileSignature size={18} />} label="Contract Signatures" />
      )}
      <SidebarItem icon={<Settings size={18} />} label="Settings" />
    </nav>
    
    <div className="p-4 border-t border-zinc-900">
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#d6ff3f] flex items-center justify-center text-black font-bold shadow-md">
          {currentOrg.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 truncate">{currentOrg.name}</p>
          <p className="text-xs text-zinc-500 truncate">{currentOrg.location}</p>
        </div>
      </div>
    </div>
  </div>
);

const SidebarItem = ({ icon, label, active = false, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string }) => (
  <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-[#d6ff3f]/10 text-[#d6ff3f]' : 'hover:bg-zinc-900 hover:text-zinc-200'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge && <span className="bg-[#d6ff3f] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{badge}</span>}
  </div>
);

const StatCard = ({ title, value, subtext, alert }: { title: string, value: string, subtext?: string, alert?: boolean }) => {
  return (
    <div className={`bg-zinc-900 p-5 rounded-xl border ${alert ? 'border-rose-900/50 bg-rose-950/10' : 'border-zinc-800'} shadow-lg shadow-black/20`}>
      <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${alert ? 'text-rose-400' : 'text-white'}`}>{value}</span>
        {subtext && <span className="text-xs text-zinc-500 mt-1">{subtext}</span>}
      </div>
    </div>
  );
};

// --- Tracker Component ---

const RenewalTracker = ({ logs }: { logs?: RenewalRequest['communicationLog'] }) => {
    const safeLogs = logs || [];

    if (safeLogs.length === 0) {
        return <div className="text-xs text-zinc-500 italic mt-4">No tracking history available</div>;
    }

    return (
        <div className="relative mt-6 mb-2">
            <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Escalation Timeline</h5>
            <div className="flex items-center justify-between w-full relative z-0">
                 {/* Progress Line Background */}
                 <div className="absolute left-0 top-4 w-full h-0.5 bg-zinc-800 -z-10" />
                 
                 {safeLogs.map((log, index) => {
                     const isCompleted = log.status === 'completed';
                     const isPending = log.status === 'pending';
                     const isUrgent = log.stage === 'Auto-Renew';
                     const Icon = log.icon;
                     
                     return (
                        <div key={index} className="flex flex-col items-center gap-2 group">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                                ${isUrgent ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' :
                                  isCompleted ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                                  isPending ? 'bg-zinc-900 border-zinc-700 text-zinc-600' : 
                                  'bg-zinc-800 border-zinc-600 text-zinc-400'}
                            `}>
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
                            </div>
                            <div className="text-center">
                                <p className={`text-[10px] font-bold uppercase tracking-wide ${isUrgent ? 'text-rose-500' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`}>{log.stage}</p>
                                <p className="text-[10px] text-zinc-600">{log.date}</p>
                            </div>
                        </div>
                     )
                 })}
            </div>
        </div>
    )
}

// --- Child Renewal Modal (Digital Signature) ---

const DigitalSignModal = ({ 
    isOpen, 
    onClose, 
    onSign, 
    device 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onSign: (deviceId: string) => void,
    device: Device | null
}) => {
    const [step, setStep] = useState<'review' | 'success'>('review');
    
    useEffect(() => {
        if (isOpen) setStep('review');
    }, [isOpen]);

    if (!isOpen || !device) return null;

    const newExpiryDate = new Date(device.expiryDate);
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

    const handleSign = () => {
        setStep('success');
        setTimeout(() => {
            onSign(device.id);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-md overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-black/30">
                    <h3 className="font-bold text-zinc-100">Renew License Authorization</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={20} /></button>
                </div>
                
                <div className="p-6">
                    {step === 'review' ? (
                        <>
                            <p className="text-sm text-zinc-400 mb-4">Please review the renewal contract terms below before digitally signing with your device key.</p>
                            
                            {/* The "Contract" Box */}
                            <div className="bg-black border border-zinc-800 rounded-lg p-5 font-mono text-sm space-y-3 mb-6 shadow-inner">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Device ID:</span>
                                    <span className="text-zinc-200 font-medium">{device.serialNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Device Name:</span>
                                    <span className="text-zinc-200 font-medium">{device.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Current Expiry:</span>
                                    <span className="text-zinc-200">{device.expiryDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">New Term:</span>
                                    <span className="text-[#d6ff3f] font-bold">+1 Year ({newExpiryDate.toISOString().split('T')[0]})</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                                    <span className="text-zinc-500">Status:</span>
                                    <span className="text-amber-500 font-bold flex items-center gap-1.5 uppercase text-xs">
                                        <AlertTriangle size={12} /> Risk of Service Loss
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={handleSign}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#d6ff3f] bg-[#d6ff3f] text-black font-bold hover:bg-[#d6ff3f]/90 transition-all hover:shadow-[0_0_15px_rgba(214,255,63,0.4)] group"
                            >
                                <FileSignature size={18} className="group-hover:scale-110 transition-transform" />
                                Sign with Device Key
                            </button>
                            <p className="text-center text-xs text-zinc-600 mt-3">This action does not process payment. It authorizes HQ to renew.</p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-4 text-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                <Check size={32} strokeWidth={3} />
                            </motion.div>
                            <h4 className="text-lg font-bold text-white mb-1">Request Signed & Sent</h4>
                            <p className="text-sm text-zinc-400 mb-6">Your parent organization has been notified.</p>
                            
                            <div className="w-full bg-black/40 rounded-lg p-3 text-left border border-zinc-800">
                                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Digital Hash</p>
                                <p className="font-mono text-emerald-500 text-xs break-all">0x7f9e2b1c4a...9d8a2b</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- Updated Parent Renewal Card with Dropdown & AI ---

const RenewalRequestCard = ({ request, device, onApprove }: { request: RenewalRequest, device: Device, onApprove: (id: string) => void }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`border border-zinc-800 rounded-lg shadow-sm mb-3 transition-colors duration-200 overflow-hidden ${expanded ? 'bg-zinc-900 border-[#d6ff3f]/50' : 'bg-zinc-900 hover:border-zinc-700'}`}>
            <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer gap-4"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex gap-4">
                    <div className="p-2 bg-[#d6ff3f]/10 text-[#d6ff3f] rounded-lg h-fit shrink-0">
                        <Shield size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-sm font-bold text-white">Renewal Request from {request.requestedBy}</h4>
                            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                <Shield size={10} fill="currentColor" className="opacity-70" />
                                Verified Signature
                            </div>
                        </div>
                        
                        <p className="text-xs text-zinc-400 mt-0.5">Device: <span className="font-medium text-zinc-200">{device.name}</span></p>
                        
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs bg-black text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                                Expiring: {request.date}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                <Database size={10} /> Smart Contract: {request.smartContractRef}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onApprove(request.id); }}
                        className="px-4 py-2 text-xs font-bold text-black bg-[#d6ff3f] hover:bg-[#d6ff3f]/90 rounded shadow-[0_0_15px_rgba(214,255,63,0.3)] flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <LinkIcon size={14} /> Approve & Mint Renewal
                    </button>
                    {expanded ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-800 bg-black/50"
                    >
                        <div className="p-5 pl-16">
                            {/* AI Agent Summary */}
                            <div className="flex gap-4 mb-6">
                                <div className="shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-lg bg-[#d6ff3f]/10 flex items-center justify-center text-[#d6ff3f] shadow-[0_0_15px_rgba(214,255,63,0.2)]">
                                        <Bot size={18} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-[#d6ff3f] mb-1">AI Risk Agent Analysis</h5>
                                    <p className="text-sm text-zinc-300 leading-relaxed bg-black/80 p-3 rounded-lg border border-zinc-800">
                                        {request.aiRiskSummary}
                                    </p>
                                </div>
                            </div>

                            {/* Tracker */}
                            <div className="pl-12">
                                <RenewalTracker logs={request.communicationLog} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Device Row ---

const DeviceRow = ({ device, orgRole, onRequestRenewal, hasPendingRequest }: { device: Device, orgRole: OrgRole, onRequestRenewal: (id: string) => void, hasPendingRequest?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const expiry = getExpiryStatus(device.expiryDate);
  const statusColor = getStatusColor(device.status);
  const statusIcon = getStatusIcon(device.status);

  return (
    <div className={`border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors ${expanded ? 'bg-zinc-900' : ''}`}>
      <div 
        className="grid grid-cols-12 items-center p-4 gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="col-span-4 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${device.status === 'Offline' ? 'bg-zinc-800' : 'bg-zinc-800 border border-zinc-700'}`}>
             <Monitor size={20} className={device.status === 'Offline' ? 'text-zinc-500' : 'text-zinc-300'} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
                <h4 className="font-semibold text-zinc-100 text-sm truncate">{device.name}</h4>
                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                    {statusIcon} {device.status.toUpperCase()}
                </span>
            </div>
            <p className="text-zinc-500 text-xs truncate mt-0.5">{device.serialNumber} • {device.hardwareType}</p>
          </div>
        </div>
        
        <div className="col-span-3 text-sm text-zinc-400">
          <div className="font-medium text-zinc-300">{device.contentName}</div>
          <div className="text-xs text-zinc-500">{device.location}</div>
        </div>
        
        <div className="col-span-3">
          <div className="flex flex-col items-start">
             <span className="text-sm font-medium text-zinc-300">
                {new Date(device.expiryDate).toLocaleDateString('en-GB')}
             </span>
             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${expiry.color}`}>
                {expiry.label}
             </span>
          </div>
        </div>

        <div className="col-span-2 flex justify-end items-center gap-3">
            {/* Contextual Action Button */}
            {expiry.urgent && (
                orgRole === 'Parent' ? (
                    <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="text-xs font-bold text-black bg-[#d6ff3f] hover:bg-[#d6ff3f]/90 px-3 py-1.5 rounded shadow-sm transition-colors"
                    >
                        Renew
                    </button>
                ) : (
                    hasPendingRequest ? (
                        <button 
                            disabled
                            className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded cursor-default flex items-center gap-1"
                        >
                            <Check size={12} strokeWidth={3} /> Signed
                        </button>
                    ) : (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRequestRenewal(device.id); }}
                            className="text-xs font-bold text-[#d6ff3f] bg-[#d6ff3f]/10 hover:bg-[#d6ff3f]/20 border border-[#d6ff3f]/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                        >
                            <FileSignature size={12} /> Sign & Notify
                        </button>
                    )
                )
            )}
          {expanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/30 border-t border-zinc-800"
          >
            <div className="p-4 pl-16 grid grid-cols-2 gap-8 text-sm text-zinc-400">
               <div>
                   <h5 className="font-bold text-xs uppercase text-zinc-600 mb-2">Device Health</h5>
                   <p className="mb-1">Last Heartbeat: <span className="font-mono text-zinc-300">{device.lastHeartbeat || 'Just now'}</span></p>
                   {device.notes && (
                       <div className="mt-2 p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs flex gap-2 items-start">
                           <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                           {device.notes}
                       </div>
                   )}
               </div>
               <div>
                   <h5 className="font-bold text-xs uppercase text-zinc-600 mb-2">Renewal Impact</h5>
                   <p className="text-zinc-500 mb-2">
                       Failure to renew by <span className="font-bold text-zinc-300">{device.expiryDate}</span> will result in content playback stopping immediately.
                       {orgRole === 'Child' && " Please contact your HQ administrator to process payment."}
                   </p>
                   {expiry.urgent && (
                     <div className="mt-3 bg-[#d6ff3f]/10 p-3 rounded-lg border border-[#d6ff3f]/20 flex gap-3">
                        <Bot size={16} className="text-[#d6ff3f] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-[#d6ff3f] mb-0.5">AI Agent Insight</p>
                          <p className="text-xs text-[#d6ff3f] leading-snug">
                            {orgRole === 'Parent' 
                              ? "High churn risk. This site has had 3 connectivity issues in the last month. Recommend bundling a hardware refresh discount with renewal."
                              : "This license is critical for your 'Flash Sale' campaign scheduled next month. Ensure HQ approves before Feb 15."}
                          </p>
                        </div>
                     </div>
                   )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Toast Component ---
const SuccessToast = ({ show, onClose }: { show: boolean, onClose: () => void }) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 20 }}
                className="fixed top-24 right-8 z-50 bg-zinc-900 border-l-4 border-emerald-500 shadow-2xl shadow-black/50 rounded-r-lg p-4 flex items-start gap-3 w-80 text-zinc-100"
            >
                <div className="bg-emerald-500/20 p-1.5 rounded-full text-emerald-400 shrink-0">
                    <Check size={16} strokeWidth={3} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">Renewal Confirmed on Ledger</h4>
                    <p className="text-xs text-zinc-400 mt-1">License extended for 1 year. Payment settled.</p>
                    <a href="#" className="text-xs text-[#d6ff3f] font-mono mt-2 block hover:underline">View Transaction: 0x88...21b</a>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
            </motion.div>
        )}
    </AnimatePresence>
)

// --- Chatbot Component ---

const Chatbot = ({ currentOrg, devices }: { currentOrg: Organization, devices: Device[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string, sender: 'user' | 'bot', text: string }[]>([
    { id: '1', sender: 'bot', text: `Hello! I'm the Allsee AI Assistant for ${currentOrg.name}. Ask me about device status, upcoming renewals, or risk assessments.` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Reset chat when org changes
  useEffect(() => {
     setMessages([{ id: '1', sender: 'bot', text: `Hello! I'm the Allsee AI Assistant for ${currentOrg.name}. Ask me about device status, upcoming renewals, or risk assessments.` }]);
  }, [currentOrg.id]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = generateResponse(inputValue, currentOrg, devices);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string, org: Organization, devices: Device[]) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('renew') || lowerQuery.includes('expiry') || lowerQuery.includes('expire')) {
        const expiring = devices.filter(d => getExpiryStatus(d.expiryDate).urgent);
        if (expiring.length === 0) return "Great news! You have no licenses expiring in the immediate future.";
        return `You have ${expiring.length} devices expiring soon. The most critical one is ${expiring[0].name} which expires on ${expiring[0].expiryDate}.`;
    }
    
    if (lowerQuery.includes('offline') || lowerQuery.includes('down') || lowerQuery.includes('status')) {
        const offline = devices.filter(d => d.status === 'Offline' || d.status === 'Error');
        if (offline.length === 0) return "All systems operational. 100% uptime currently.";
        return `Attention needed: ${offline.length} devices are currently not communicating with the server. Check ${offline[0].name} in ${offline[0].location}.`;
    }

    if (lowerQuery.includes('risk') || lowerQuery.includes('analysis')) {
        return "My analysis shows a medium risk profile for the Birmingham cluster due to recent connectivity flutters. I recommend processing renewals early to prevent any service gaps during the upcoming holiday season.";
    }

    return "I can help you track license expiry dates, monitor device health, or analyze renewal risks. Try asking 'Which devices are offline?' or 'Show me expiring licenses'.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-[#d6ff3f] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm">Allsee Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-black/50 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-black font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/70 hover:text-black transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#d6ff3f] text-black rounded-br-none' 
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 bg-zinc-900 border-t border-zinc-800">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about renewals..."
                  className="w-full bg-black text-zinc-200 text-sm rounded-xl pl-4 pr-10 py-3 border border-zinc-800 focus:outline-none focus:border-[#d6ff3f] focus:ring-1 focus:ring-[#d6ff3f] placeholder:text-zinc-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#d6ff3f] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d6ff3f]/90 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg shadow-black/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 ${isOpen ? 'bg-zinc-700 text-white rotate-90' : 'bg-[#d6ff3f] text-black'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
      </button>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentOrgId, setCurrentOrgId] = useState<string>('org_parent');
  const [renewalRequests, setRenewalRequests] = useState<RenewalRequest[]>(INITIAL_REQUESTS);
  
  // Modal State
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedDeviceForSign, setSelectedDeviceForSign] = useState<Device | null>(null);
  
  // Toast State
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const currentOrg = ORGANIZATIONS.find(o => o.id === currentOrgId) || ORGANIZATIONS[0];
  
  const visibleDevices = useMemo(() => {
    if (currentOrg.role === 'Parent') {
        return DEVICES;
    } else {
        return DEVICES.filter(d => d.orgId === currentOrg.id);
    }
  }, [currentOrg.id, currentOrg.role]);

  // Derived Stats
  const expiringSoonCount = visibleDevices.filter(d => getExpiryStatus(d.expiryDate).urgent).length;
  const offlineCount = visibleDevices.filter(d => d.status === 'Offline' || d.status === 'Error').length;
  const totalDevices = visibleDevices.length;

  const handleOpenSignModal = (deviceId: string) => {
      const device = DEVICES.find(d => d.id === deviceId);
      if (device) {
          setSelectedDeviceForSign(device);
          setIsSignModalOpen(true);
      }
  };

  const handleSignConfirm = (deviceId: string) => {
      const device = DEVICES.find(d => d.id === deviceId);
      if (!device) return;

      // Generate context-aware AI summary
      let aiSummary = '';
      if (device.contentName.toLowerCase().includes('sale') || device.contentName.toLowerCase().includes('promo') || device.contentName.toLowerCase().includes('special')) {
          aiSummary = `High commercial impact. This device is currently displaying '${device.contentName}'. Failure to renew will immediately halt this active campaign, potentially leading to a 15-20% drop in local conversion rates.`;
      } else if (device.hardwareType.includes('LED') || device.hardwareType.includes('Header')) {
          aiSummary = `Brand reputation risk. This is a prominent ${device.hardwareType} installation in ${device.location}. A black screen here would be highly visible and damaging to the brand image.`;
      } else if (device.status === 'Offline') {
           aiSummary = `Technical recovery risk. Device is currently Offline. Renewal is strictly required to re-establish heartbeat and push recovery firmware.`;
      } else {
          aiSummary = `Operational continuity risk. This screen is a key touchpoint in ${device.location}. Non-renewal will result in a black screen during peak operating hours.`;
      }

      const newReq: RenewalRequest = {
          id: `req_${Date.now()}`,
          deviceId: device.id,
          childOrgId: currentOrg.id,
          requestedBy: `${currentOrg.name} Admin`,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          digitalHash: `0x${Math.random().toString(16).slice(2)}...${Math.random().toString(16).slice(2)}`,
          smartContractRef: 'Allsee_Sub_v2',
          aiRiskSummary: aiSummary,
          communicationLog: [
            { stage: 'Email Warning', date: 'Just now', status: 'completed', icon: Mail },
            { stage: 'Phone Follow-up', date: 'Pending', status: 'pending', icon: Phone },
            { stage: 'CMS Popup', date: 'Pending', status: 'pending', icon: MessageSquare },
            { stage: 'Auto-Renew', date: 'Next Month', status: 'pending', icon: RefreshCw },
          ]
      };
      
      setRenewalRequests(prev => [...prev, newReq]);
  };

  const handleApproveRenewal = (reqId: string) => {
      setRenewalRequests(prev => prev.filter(r => r.id !== reqId));
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
  };

  return (
    <div className="flex h-screen bg-black font-sans text-zinc-100 selection:bg-[#d6ff3f]/30 selection:text-black">
      <Sidebar currentOrg={currentOrg} onSwitchOrg={setCurrentOrgId} />
      
      {/* Toast Notification */}
      <SuccessToast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} />

      {/* Signature Modal */}
      <DigitalSignModal 
          isOpen={isSignModalOpen} 
          onClose={() => setIsSignModalOpen(false)} 
          onSign={handleSignConfirm}
          device={selectedDeviceForSign}
      />

      {/* Chatbot */}
      <Chatbot currentOrg={currentOrg} devices={visibleDevices} />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div>
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                    {currentOrg.role === 'Parent' ? 'Renewal Centre' : 'Subscription Status'}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${currentOrg.role === 'Parent' ? 'bg-[#d6ff3f]/10 text-[#d6ff3f] border-[#d6ff3f]/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {currentOrg.role} View
                </span>
            </div>
            <p className="text-zinc-500 text-sm mt-1">
                {currentOrg.role === 'Parent' 
                    ? 'Manage risk and process renewals across your organization hierarchy.' 
                    : 'Monitor device license status and request renewals from HQ.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
               <input 
                 type="text" 
                 placeholder="Search devices..." 
                 className="pl-9 pr-4 py-2 bg-black border border-zinc-800 rounded-lg text-sm text-zinc-200 w-64 focus:ring-2 focus:ring-[#d6ff3f] focus:outline-none focus:border-[#d6ff3f] transition-all placeholder:text-zinc-600"
               />
             </div>
             {currentOrg.role === 'Parent' && (
                 <button className="bg-[#d6ff3f] hover:bg-[#d6ff3f]/90 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#d6ff3f]/20">
                   <CreditCard size={16} />
                   Bulk Renew
                 </button>
             )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Total Licenses" 
                value={totalDevices.toString()} 
                subtext="Active across all sites" 
            />
            <StatCard 
                title="Attention Needed" 
                value={expiringSoonCount.toString()} 
                subtext="Expiring within 90 days" 
                alert={expiringSoonCount > 0} 
            />
            <StatCard 
                title="Network Health" 
                value={`${((totalDevices - offlineCount) / totalDevices * 100).toFixed(0)}%`} 
                subtext={`${offlineCount} devices offline/error`} 
                alert={offlineCount > 0} 
            />
          </div>

          {/* AI Risk Summary (Context Aware) */}
          <div className="bg-zinc-900 border border-[#d6ff3f]/20 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-[#d6ff3f]/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              {currentOrg.role === 'Parent' ? (
                <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-[#d6ff3f]/10 rounded-lg backdrop-blur-sm border border-[#d6ff3f]/20">
                        <Bot size={24} className="text-[#d6ff3f]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 text-white">AI Renewal Risk Analysis</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-3xl">
                            Based on expiry dates and child organization activity, 'Allsee Birmingham' has 2 devices at critical risk of service interruption in Q1 2026. Recommended action: Process pending requests immediately to avoid downtime.
                        </p>
                    </div>
                </div>
              ) : (
                <div className="relative z-10">
                    <p className="font-bold text-white text-lg leading-relaxed">
                        License 00000201 expires on 31/03/2026. To avoid service disruption and black screens, please request a renewal.
                    </p>
                </div>
              )}
          </div>

          {/* Parent Only: Renewal Requests Inbox */}
          {currentOrg.role === 'Parent' && renewalRequests.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider">Pending Renewal Requests</h3>
                      <span className="bg-[#d6ff3f]/10 text-[#d6ff3f] text-xs font-bold px-2 py-0.5 rounded-full border border-[#d6ff3f]/20">{renewalRequests.length} New</span>
                  </div>
                  <div>
                      {renewalRequests.map(req => {
                          const device = DEVICES.find(d => d.id === req.deviceId);
                          if (!device) return null;
                          return <RenewalRequestCard key={req.id} request={req} device={device} onApprove={handleApproveRenewal} />;
                      })}
                  </div>
              </div>
          )}

          {/* Main Device List */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
              <h2 className="text-lg font-bold text-white">Device Licenses</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors">
                  <Filter size={16} /> Status
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors">
                  <MoreVertical size={16} /> Sort
                </button>
              </div>
            </div>

            {/* Table Header */}
            <div className="bg-black/50 border-b border-zinc-800 grid grid-cols-12 px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-4">Device / Status</div>
              <div className="col-span-3">Content / Location</div>
              <div className="col-span-3">Expiry</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* List */}
            <div className="divide-y divide-zinc-800 min-h-[300px]">
              {visibleDevices.map(device => (
                <DeviceRow 
                    key={device.id} 
                    device={device} 
                    orgRole={currentOrg.role} 
                    onRequestRenewal={handleOpenSignModal}
                    hasPendingRequest={renewalRequests.some(r => r.deviceId === device.id)}
                />
              ))}
              {visibleDevices.length === 0 && (
                  <div className="p-8 text-center text-zinc-500">
                      No devices found for this organization context.
                  </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

