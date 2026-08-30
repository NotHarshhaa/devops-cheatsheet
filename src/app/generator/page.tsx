'use client';

import * as React from 'react';
import { 
  Zap, 
  Terminal, 
  Box, 
  Layers, 
  Lock, 
  Clock, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRight,
  Code2,
  FileCode
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

export default function GeneratorPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  // --- DOCKER GENERATOR STATE ---
  const [dockerName, setDockerName] = React.useState('my-api');
  const [dockerImage, setDockerImage] = React.useState('node:18-alpine');
  const [dockerHostPort, setDockerHostPort] = React.useState('8080');
  const [dockerContainerPort, setDockerContainerPort] = React.useState('8080');
  const [dockerVolumeHost, setDockerVolumeHost] = React.useState('./data');
  const [dockerVolumeTarget, setDockerVolumeTarget] = React.useState('/app/data');
  const [dockerEnv, setDockerEnv] = React.useState('NODE_ENV=production,PORT=8080');
  const [dockerRestart, setDockerRestart] = React.useState('unless-stopped');
  const [dockerDetach, setDockerDetach] = React.useState(true);
  const [dockerView, setDockerView] = React.useState<'cli' | 'compose'>('cli');

  const dockerRunCmd = React.useMemo(() => {
    let cmd = `docker run`;
    if (dockerDetach) cmd += ` -d`;
    if (dockerName) cmd += ` --name ${dockerName}`;
    if (dockerRestart && dockerRestart !== 'no') cmd += ` --restart ${dockerRestart}`;
    if (dockerHostPort && dockerContainerPort) cmd += ` -p ${dockerHostPort}:${dockerContainerPort}`;
    if (dockerVolumeHost && dockerVolumeTarget) cmd += ` -v ${dockerVolumeHost}:${dockerVolumeTarget}`;
    if (dockerEnv) {
      dockerEnv.split(',').forEach(pair => {
        const trimmed = pair.trim();
        if (trimmed) cmd += ` -e ${trimmed}`;
      });
    }
    cmd += ` ${dockerImage || 'alpine'}`;
    return cmd;
  }, [dockerName, dockerImage, dockerHostPort, dockerContainerPort, dockerVolumeHost, dockerVolumeTarget, dockerEnv, dockerRestart, dockerDetach]);

  const dockerComposeYaml = React.useMemo(() => {
    const envLines = dockerEnv
      ? dockerEnv.split(',').map(e => `      - ${e.trim()}`).join('\n')
      : '';

    return `version: '3.8'

services:
  ${dockerName || 'app'}:
    image: ${dockerImage || 'alpine'}
    container_name: ${dockerName || 'app'}
    restart: ${dockerRestart}
    ports:
      - "${dockerHostPort || '80'}:${dockerContainerPort || '80'}"
    volumes:
      - "${dockerVolumeHost}:${dockerVolumeTarget}"${envLines ? `\n    environment:\n${envLines}` : ''}
`;
  }, [dockerName, dockerImage, dockerHostPort, dockerContainerPort, dockerVolumeHost, dockerVolumeTarget, dockerEnv, dockerRestart]);

  // --- KUBERNETES GENERATOR STATE ---
  const [k8sKind, setK8sKind] = React.useState<'Deployment' | 'Service' | 'Pod'>('Deployment');
  const [k8sAppName, setK8sAppName] = React.useState('web-backend');
  const [k8sNamespace, setK8sNamespace] = React.useState('production');
  const [k8sImage, setK8sImage] = React.useState('nginx:alpine');
  const [k8sReplicas, setK8sReplicas] = React.useState('3');
  const [k8sPort, setK8sPort] = React.useState('80');
  const [k8sServiceType, setK8sServiceType] = React.useState('ClusterIP');

  const k8sYaml = React.useMemo(() => {
    if (k8sKind === 'Deployment') {
      return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${k8sAppName}
  namespace: ${k8sNamespace}
  labels:
    app.kubernetes.io/name: ${k8sAppName}
spec:
  replicas: ${k8sReplicas}
  selector:
    matchLabels:
      app: ${k8sAppName}
  template:
    metadata:
      labels:
        app: ${k8sAppName}
    spec:
      containers:
        - name: ${k8sAppName}
          image: ${k8sImage}
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: ${k8sPort}
              name: http
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
`;
    }

    if (k8sKind === 'Service') {
      return `apiVersion: v1
kind: Service
metadata:
  name: ${k8sAppName}-svc
  namespace: ${k8sNamespace}
  labels:
    app.kubernetes.io/name: ${k8sAppName}
spec:
  type: ${k8sServiceType}
  selector:
    app: ${k8sAppName}
  ports:
    - name: http
      protocol: TCP
      port: ${k8sPort}
      targetPort: ${k8sPort}
`;
    }

    return `apiVersion: v1
kind: Pod
metadata:
  name: ${k8sAppName}
  namespace: ${k8sNamespace}
  labels:
    app: ${k8sAppName}
spec:
  containers:
    - name: ${k8sAppName}
      image: ${k8sImage}
      ports:
        - containerPort: ${k8sPort}
`;
  }, [k8sKind, k8sAppName, k8sNamespace, k8sImage, k8sReplicas, k8sPort, k8sServiceType]);

  // --- LINUX CHMOD CALCULATOR STATE ---
  const [permissions, setPermissions] = React.useState({
    owner: { r: true, w: true, x: true },
    group: { r: true, w: false, x: true },
    others: { r: true, w: false, x: true },
  });

  const togglePermission = (role: 'owner' | 'group' | 'others', type: 'r' | 'w' | 'x') => {
    setPermissions(prev => ({
      ...prev,
      [role]: { ...prev[role], [type]: !prev[role][type] }
    }));
  };

  const getOctalDigit = (perm: { r: boolean; w: boolean; x: boolean }) => {
    let digit = 0;
    if (perm.r) digit += 4;
    if (perm.w) digit += 2;
    if (perm.x) digit += 1;
    return digit;
  };

  const octalValue = `${getOctalDigit(permissions.owner)}${getOctalDigit(permissions.group)}${getOctalDigit(permissions.others)}`;

  const symbolicValue = `-${permissions.owner.r ? 'r' : '-'}${permissions.owner.w ? 'w' : '-'}${permissions.owner.x ? 'x' : '-'}${permissions.group.r ? 'r' : '-'}${permissions.group.w ? 'w' : '-'}${permissions.group.x ? 'x' : '-'}${permissions.others.r ? 'r' : '-'}${permissions.others.w ? 'w' : '-'}${permissions.others.x ? 'x' : '-'}`;

  const setChmodPreset = (octal: string) => {
    const o = parseInt(octal[0], 10);
    const g = parseInt(octal[1], 10);
    const u = parseInt(octal[2], 10);
    setPermissions({
      owner: { r: Boolean(o & 4), w: Boolean(o & 2), x: Boolean(o & 1) },
      group: { r: Boolean(g & 4), w: Boolean(g & 2), x: Boolean(g & 1) },
      others: { r: Boolean(u & 4), w: Boolean(u & 2), x: Boolean(u & 1) },
    });
  };

  // --- CRON BUILDER STATE ---
  const [cronMinute, setCronMinute] = React.useState('*/15');
  const [cronHour, setCronHour] = React.useState('*');
  const [cronDay, setCronDay] = React.useState('*');
  const [cronMonth, setCronMonth] = React.useState('*');
  const [cronWeekday, setCronWeekday] = React.useState('*');

  const cronExpression = `${cronMinute} ${cronHour} ${cronDay} ${cronMonth} ${cronWeekday}`;

  const setCronPreset = (expr: string) => {
    const parts = expr.split(' ');
    if (parts.length === 5) {
      setCronMinute(parts[0]);
      setCronHour(parts[1]);
      setCronDay(parts[2]);
      setCronMonth(parts[3]);
      setCronWeekday(parts[4]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 sm:py-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header HUD */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE TOOL WORKBENCH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-mono mb-4">
            DevOps Command & Config Generator
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Interactively build, customize, and copy production-tested Docker commands, Kubernetes manifests, Linux permissions, and Cron schedules.
          </p>
        </div>

        {/* Main Workbench Tabs */}
        <Tabs defaultValue="docker" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-secondary/80 p-1 rounded-2xl border border-border/60">
              <TabsTrigger value="docker" className="rounded-xl gap-2 font-mono text-xs sm:text-sm px-4">
                <Box className="w-4 h-4 text-cyan-500" />
                <span>Docker</span>
              </TabsTrigger>
              <TabsTrigger value="k8s" className="rounded-xl gap-2 font-mono text-xs sm:text-sm px-4">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Kubernetes</span>
              </TabsTrigger>
              <TabsTrigger value="chmod" className="rounded-xl gap-2 font-mono text-xs sm:text-sm px-4">
                <Lock className="w-4 h-4 text-purple-500" />
                <span>Chmod Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="cron" className="rounded-xl gap-2 font-mono text-xs sm:text-sm px-4">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Cron Schedule</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: DOCKER BUILDER */}
          <TabsContent value="docker">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form inputs */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="rounded-2xl border-border/80 p-6 space-y-4">
                  <div className="text-sm font-mono font-bold text-foreground flex items-center justify-between pb-2 border-b border-border/60">
                    <span>Container Options</span>
                    <Badge variant="outline" className="font-mono text-[10px]">v24.0 Engine</Badge>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Container Name</label>
                    <Input
                      value={dockerName}
                      onChange={(e) => setDockerName(e.target.value)}
                      placeholder="my-app"
                      className="font-mono text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Docker Image</label>
                    <Input
                      value={dockerImage}
                      onChange={(e) => setDockerImage(e.target.value)}
                      placeholder="e.g. redis:alpine, nginx:latest"
                      className="font-mono text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground">Host Port</label>
                      <Input
                        value={dockerHostPort}
                        onChange={(e) => setDockerHostPort(e.target.value)}
                        placeholder="8080"
                        className="font-mono text-xs h-9 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground">Container Port</label>
                      <Input
                        value={dockerContainerPort}
                        onChange={(e) => setDockerContainerPort(e.target.value)}
                        placeholder="80"
                        className="font-mono text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground">Host Volume</label>
                      <Input
                        value={dockerVolumeHost}
                        onChange={(e) => setDockerVolumeHost(e.target.value)}
                        placeholder="./data"
                        className="font-mono text-xs h-9 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground">Container Mount</label>
                      <Input
                        value={dockerVolumeTarget}
                        onChange={(e) => setDockerVolumeTarget(e.target.value)}
                        placeholder="/app/data"
                        className="font-mono text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Env Vars (comma separated)</label>
                    <Input
                      value={dockerEnv}
                      onChange={(e) => setDockerEnv(e.target.value)}
                      placeholder="KEY=VALUE,ENV=prod"
                      className="font-mono text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Restart Policy</label>
                    <select
                      value={dockerRestart}
                      onChange={(e) => setDockerRestart(e.target.value)}
                      className="w-full h-9 rounded-xl bg-background border border-border/80 px-3 text-xs font-mono text-foreground focus:outline-none"
                    >
                      <option value="no">no</option>
                      <option value="always">always</option>
                      <option value="unless-stopped">unless-stopped</option>
                      <option value="on-failure">on-failure</option>
                    </select>
                  </div>
                </Card>
              </div>

              {/* Output Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={dockerView === 'cli' ? 'default' : 'outline'}
                      onClick={() => setDockerView('cli')}
                      className="rounded-xl text-xs font-mono gap-1.5 h-8"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>docker run</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={dockerView === 'compose' ? 'default' : 'outline'}
                      onClick={() => setDockerView('compose')}
                      className="rounded-xl text-xs font-mono gap-1.5 h-8"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>docker-compose.yml</span>
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(dockerView === 'cli' ? dockerRunCmd : dockerComposeYaml, 'docker')}
                    className="rounded-xl text-xs font-mono gap-1.5 h-8 bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  >
                    {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'docker' ? 'Copied' : 'Copy Output'}</span>
                  </Button>
                </div>

                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-zinc-200">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-xs text-zinc-400 font-sans">
                        {dockerView === 'cli' ? 'bash' : 'docker-compose.yml'}
                      </span>
                    </div>
                  </div>
                  <pre className="p-5 overflow-x-auto leading-relaxed text-cyan-300">
                    <code>{dockerView === 'cli' ? dockerRunCmd : dockerComposeYaml}</code>
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: KUBERNETES MANIFEST BUILDER */}
          <TabsContent value="k8s">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <Card className="rounded-2xl border-border/80 p-6 space-y-4">
                  <div className="text-sm font-mono font-bold text-foreground flex items-center justify-between pb-2 border-b border-border/60">
                    <span>Manifest Configuration</span>
                    <Badge variant="outline" className="font-mono text-[10px]">K8s v1.30</Badge>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Resource Kind</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Deployment', 'Service', 'Pod'] as const).map(k => (
                        <Button
                          key={k}
                          type="button"
                          variant={k8sKind === k ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setK8sKind(k)}
                          className="text-xs font-mono h-8 rounded-xl"
                        >
                          {k}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">App Name</label>
                    <Input
                      value={k8sAppName}
                      onChange={(e) => setK8sAppName(e.target.value)}
                      placeholder="app-name"
                      className="font-mono text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Namespace</label>
                    <Input
                      value={k8sNamespace}
                      onChange={(e) => setK8sNamespace(e.target.value)}
                      placeholder="default"
                      className="font-mono text-xs h-9 rounded-xl"
                    />
                  </div>

                  {k8sKind !== 'Service' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-muted-foreground">Container Image</label>
                        <Input
                          value={k8sImage}
                          onChange={(e) => setK8sImage(e.target.value)}
                          placeholder="nginx:alpine"
                          className="font-mono text-xs h-9 rounded-xl"
                        />
                      </div>

                      {k8sKind === 'Deployment' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-muted-foreground">Replicas</label>
                          <Input
                            type="number"
                            value={k8sReplicas}
                            onChange={(e) => setK8sReplicas(e.target.value)}
                            min="1"
                            max="20"
                            className="font-mono text-xs h-9 rounded-xl"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground">Container Port</label>
                    <Input
                      value={k8sPort}
                      onChange={(e) => setK8sPort(e.target.value)}
                      placeholder="80"
                      className="font-mono text-xs h-9 rounded-xl"
                    />
                  </div>

                  {k8sKind === 'Service' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground">Service Type</label>
                      <select
                        value={k8sServiceType}
                        onChange={(e) => setK8sServiceType(e.target.value)}
                        className="w-full h-9 rounded-xl bg-background border border-border/80 px-3 text-xs font-mono text-foreground focus:outline-none"
                      >
                        <option value="ClusterIP">ClusterIP</option>
                        <option value="NodePort">NodePort</option>
                        <option value="LoadBalancer">LoadBalancer</option>
                      </select>
                    </div>
                  )}
                </Card>
              </div>

              {/* Output Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    Generated Kubernetes Manifest
                  </span>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(k8sYaml, 'k8s')}
                    className="rounded-xl text-xs font-mono gap-1.5 h-8 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    {copiedKey === 'k8s' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'k8s' ? 'Copied' : 'Copy YAML'}</span>
                  </Button>
                </div>

                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-zinc-200">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-xs text-zinc-400 font-sans">
                        manifest.yaml
                      </span>
                    </div>
                  </div>
                  <pre className="p-5 overflow-x-auto leading-relaxed text-blue-300">
                    <code>{k8sYaml}</code>
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: CHMOD CALCULATOR */}
          <TabsContent value="chmod">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-6">
                <Card className="rounded-2xl border-border/80 p-6 space-y-6">
                  <div className="text-sm font-mono font-bold text-foreground pb-2 border-b border-border/60">
                    Interactive Permission Matrix
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    {/* Owner */}
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-3">
                      <div className="font-mono text-xs font-bold text-foreground">User / Owner</div>
                      <div className="space-y-2">
                        {(['r', 'w', 'x'] as const).map(p => (
                          <label key={p} className="flex items-center justify-between text-xs font-mono p-1 rounded hover:bg-accent cursor-pointer">
                            <span>{p === 'r' ? 'Read (4)' : p === 'w' ? 'Write (2)' : 'Execute (1)'}</span>
                            <input
                              type="checkbox"
                              checked={permissions.owner[p]}
                              onChange={() => togglePermission('owner', p)}
                              className="rounded border-border"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Group */}
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-3">
                      <div className="font-mono text-xs font-bold text-foreground">Group</div>
                      <div className="space-y-2">
                        {(['r', 'w', 'x'] as const).map(p => (
                          <label key={p} className="flex items-center justify-between text-xs font-mono p-1 rounded hover:bg-accent cursor-pointer">
                            <span>{p === 'r' ? 'Read (4)' : p === 'w' ? 'Write (2)' : 'Execute (1)'}</span>
                            <input
                              type="checkbox"
                              checked={permissions.group[p]}
                              onChange={() => togglePermission('group', p)}
                              className="rounded border-border"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Others */}
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-3">
                      <div className="font-mono text-xs font-bold text-foreground">Others / Public</div>
                      <div className="space-y-2">
                        {(['r', 'w', 'x'] as const).map(p => (
                          <label key={p} className="flex items-center justify-between text-xs font-mono p-1 rounded hover:bg-accent cursor-pointer">
                            <span>{p === 'r' ? 'Read (4)' : p === 'w' ? 'Write (2)' : 'Execute (1)'}</span>
                            <input
                              type="checkbox"
                              checked={permissions.others[p]}
                              onChange={() => togglePermission('others', p)}
                              className="rounded border-border"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Common Presets */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-muted-foreground">Standard Linux Presets:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { code: '755', desc: 'Web Script' },
                        { code: '644', desc: 'Standard File' },
                        { code: '600', desc: 'SSH Private Key' },
                        { code: '700', desc: 'Private Script' },
                      ].map(preset => (
                        <Button
                          key={preset.code}
                          variant="outline"
                          size="sm"
                          onClick={() => setChmodPreset(preset.code)}
                          className="h-auto py-2 flex flex-col items-center rounded-xl text-xs font-mono"
                        >
                          <span className="font-bold text-primary">{preset.code}</span>
                          <span className="text-[10px] text-muted-foreground">{preset.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Output */}
              <div className="lg:col-span-6 space-y-4">
                <Card className="rounded-2xl border-border/80 p-6 space-y-6">
                  <div className="text-sm font-mono font-bold text-foreground pb-2 border-b border-border/60">
                    Calculated Result
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border text-center">
                      <div className="text-xs font-mono text-muted-foreground mb-1">Octal Code</div>
                      <div className="text-4xl font-black font-mono text-purple-500">{octalValue}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border text-center">
                      <div className="text-xs font-mono text-muted-foreground mb-1">Symbolic Notation</div>
                      <div className="text-2xl font-black font-mono text-cyan-500 mt-1">{symbolicValue}</div>
                    </div>
                  </div>

                  {/* Commands */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-muted-foreground">Terminal Command:</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200">
                      <span>chmod {octalValue} myfile.sh</span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`chmod ${octalValue} myfile.sh`, 'chmod-cmd')}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copiedKey === 'chmod-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200">
                      <span>chmod -R {octalValue} /var/www/html/</span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`chmod -R ${octalValue} /var/www/html/`, 'chmod-rec')}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copiedKey === 'chmod-rec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: CRON BUILDER */}
          <TabsContent value="cron">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <Card className="rounded-2xl border-border/80 p-6 space-y-4">
                  <div className="text-sm font-mono font-bold text-foreground pb-2 border-b border-border/60">
                    Cron Interval Fields
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted-foreground">Minute</label>
                      <Input
                        value={cronMinute}
                        onChange={(e) => setCronMinute(e.target.value)}
                        className="font-mono text-xs text-center h-8 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted-foreground">Hour</label>
                      <Input
                        value={cronHour}
                        onChange={(e) => setCronHour(e.target.value)}
                        className="font-mono text-xs text-center h-8 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted-foreground">Day/Mo</label>
                      <Input
                        value={cronDay}
                        onChange={(e) => setCronDay(e.target.value)}
                        className="font-mono text-xs text-center h-8 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted-foreground">Month</label>
                      <Input
                        value={cronMonth}
                        onChange={(e) => setCronMonth(e.target.value)}
                        className="font-mono text-xs text-center h-8 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted-foreground">Weekday</label>
                      <Input
                        value={cronWeekday}
                        onChange={(e) => setCronWeekday(e.target.value)}
                        className="font-mono text-xs text-center h-8 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono text-muted-foreground">Common DevOps Schedules:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { label: 'Every 5 Minutes', expr: '*/5 * * * *' },
                        { label: 'Every Hour at :00', expr: '0 * * * *' },
                        { label: 'Every Day at Midnight', expr: '0 0 * * *' },
                        { label: 'Every Sunday at 2 AM', expr: '0 2 * * 0' },
                        { label: 'Weekdays at 9 AM', expr: '0 9 * * 1-5' },
                        { label: 'Twice a Month', expr: '0 0 1,15 * *' },
                      ].map(p => (
                        <Button
                          key={p.label}
                          variant="outline"
                          size="sm"
                          onClick={() => setCronPreset(p.expr)}
                          className="justify-between text-xs font-mono h-8 rounded-xl"
                        >
                          <span>{p.label}</span>
                          <span className="text-[10px] text-primary">{p.expr}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Output Preview */}
              <div className="lg:col-span-6 space-y-4">
                <Card className="rounded-2xl border-border/80 p-6 space-y-6">
                  <div className="text-sm font-mono font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
                    <span>Cron Expression</span>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(cronExpression, 'cron')}
                      className="rounded-xl text-xs font-mono gap-1.5 h-7 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    >
                      {copiedKey === 'cron' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'cron' ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-amber-400 tracking-wider">
                      {cronExpression}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      minute · hour · day of month · month · day of week
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-mono text-muted-foreground">Crontab Entry Example:</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200">
                      <span>{cronExpression} /usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1</span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`${cronExpression} /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1`, 'crontab-full')}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copiedKey === 'crontab-full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
