"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAssets } from "@/lib/assets";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { 
  Cpu, Layers, Zap, PenTool, Activity, 
  Rotate3d, Disc, Hammer, Compass, CheckCircle
} from "lucide-react";

interface CourseTopic {
  id: string;
  name: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  color: "blue" | "amber" | "green" | "saffron";
  details: string[];
}

interface WorkbenchParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  color?: string;
  size?: number;
  type?: string;
}

const topics: CourseTopic[] = [
  {
    id: "cad",
    name: "Computer Aided Design",
    code: "AE642",
    icon: Rotate3d,
    color: "blue",
    summary: "Parametric design, 3D modeling, assembly hierarchy, and dimensioning standards for space structures.",
    details: ["3D solid modeling", "Geometric dimensioning & tolerancing", "Assembly constraint networks", "B-rep & CSG modeling"],
  },
  {
    id: "cam",
    name: "Computer Aided Manufacturing",
    code: "AE642",
    icon: Disc,
    color: "amber",
    summary: "CNC tooling paths, G-code/M-code generation, machine post-processing, and multi-axis control loops.",
    details: ["Multi-axis cutter paths", "G-code compiler", "Feed & speed optimization", "Post-processor algorithms"],
  },
  {
    id: "additive",
    name: "Additive Manufacturing",
    code: "AE645",
    icon: Layers,
    color: "green",
    summary: "Laser powder bed fusion, fused filament fabrication, stereolithography, and design for additive manufacturing.",
    details: ["Laser scan strategies", "Thermal stress analysis", "Powder bed optimization", "Lattice structure design"],
  },
  {
    id: "subtractive",
    name: "Subtractive Processes",
    code: "AE642",
    icon: PenTool,
    color: "saffron",
    summary: "Milling, turning, grinding, tool-wear mechanics, shear-zone thermodynamics, and surface finish profiles.",
    details: ["Orthogonal cutting", "Merchant's force circle", "Taylor's tool life formula", "Surface roughness analysis"],
  },
  {
    id: "nonconventional",
    name: "Non-Conventional Machining",
    code: "AE644",
    icon: Zap,
    color: "blue",
    summary: "Electro-discharge machining (EDM), laser-beam cutting, abrasive jet processing, and chemical milling.",
    details: ["Spark erosion physics", "Plasma channel energetics", "Dielectric flow modeling", "Material removal rate"],
  },
  {
    id: "metrology",
    name: "Metrology & Quality",
    code: "AE804",
    icon: Compass,
    color: "green",
    summary: "Coordinate measuring machines (CMM), surface laser scanning, optical comparators, and statistical quality control.",
    details: ["Interferometry principles", "GD&T inspection protocols", "Uncertainty budget calculation", "Laser profilometry"],
  },
  {
    id: "welding",
    name: "Advanced Welding Technology",
    code: "AE647",
    icon: Hammer,
    color: "amber",
    summary: "TIG, MIG, friction stir welding, electron beam welding, and heat-affected zone metallurgical studies.",
    details: ["Friction stir mechanics", "Heat-affected zone (HAZ) phase shifts", "Plasma arc dynamics", "Weld bead geometry control"],
  },
  {
    id: "composite",
    name: "Composite Technology",
    code: "AE646",
    icon: Layers,
    color: "saffron",
    summary: "Autoclave processing, filament winding, vacuum-assisted resin transfer molding (VARTM), and layup mechanics.",
    details: ["Classical laminate theory", "Resin flow kinetics", "Void formation mitigation", "Filament tension control"],
  },
  {
    id: "fem",
    name: "Finite Element Method",
    code: "AE601",
    icon: Activity,
    color: "blue",
    summary: "Stress-strain tensors, mesh generation, boundary conditions, dynamic response, and thermo-structural analysis.",
    details: ["Stiffness matrix derivation", "Isoparametric formulation", "Von Mises yield criterion", "Thermal expansion loads"],
  },
  {
    id: "materials",
    name: "Advanced Engineering Materials",
    code: "AE641",
    icon: Cpu,
    color: "green",
    summary: "Superalloys, titanium grades, metal matrix composites, shape memory alloys, and structural characterization.",
    details: ["Intermetallics & superalloys", "Dislocation glide & climb", "Austenite-Martensite phase shifts", "SEM & XRD micro-analysis"],
  },
];

export function InteractiveWorkbench() {
  const [activeTopic, setActiveTopic] = useState<CourseTopic>(topics[0]);
  const { getVideoPath, getPhotoPath } = useAssets();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interactiveStateRef = useRef<Record<string, any>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check if dynamic user assets are available
  const userVideo = getVideoPath(`${activeTopic.id}.mp4`) || getVideoPath(`${activeTopic.id}.webm`);
  const userPhoto = getPhotoPath(`${activeTopic.id}.jpg`) || getPhotoPath(`${activeTopic.id}.png`);

  // Handle Interactive Simulator Loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: WorkbenchParticle[] = [];
    let frame = 0;

    // Resize canvas to container
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 500;
      canvas.height = rect?.height || 350;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Setup Topic-Specific Initial State
    if (activeTopic.id === "cad") {
      interactiveStateRef.current = { rotationX: 0.5, rotationY: 0.5, zoom: 1 };
    } else if (activeTopic.id === "cam") {
      interactiveStateRef.current = { toolX: 50, toolY: 50, path: [] };
    } else if (activeTopic.id === "additive") {
      interactiveStateRef.current = { printHeight: 0, pathIndex: 0 };
    } else if (activeTopic.id === "subtractive") {
      interactiveStateRef.current = { cutterX: 50, cutting: false, shards: [] };
    } else if (activeTopic.id === "nonconventional") {
      interactiveStateRef.current = { dischargeX: 50, active: false };
    } else if (activeTopic.id === "metrology") {
      interactiveStateRef.current = { laserX: 0, scanPoints: [] };
    } else if (activeTopic.id === "welding") {
      interactiveStateRef.current = { torchX: 50, torchY: 50, weldLine: [] };
    } else if (activeTopic.id === "composite") {
      interactiveStateRef.current = { layers: 1 };
    } else if (activeTopic.id === "fem") {
      interactiveStateRef.current = { forceX: 0, forceY: 0, load: 10 };
    } else if (activeTopic.id === "materials") {
      interactiveStateRef.current = { temp: 300 };
    }

    // Interactive Loop
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw a grid in the background (machined workshop surface)
      ctx.strokeStyle = "rgba(184, 196, 208, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // RENDER FALLBACK SIMULATION BASED ON ACTIVE TOPIC
      if (activeTopic.id === "cad") {
        // CAD Simulated Parametric Mesh Rotation
        ctx.save();
        ctx.translate(w / 2, h / 2);
        
        // Draw 3D wireframe box
        const size = 100;
        const angleX = (frame * 0.005) + (interactiveStateRef.current.rotationX || 0);
        const angleY = (frame * 0.008) + (interactiveStateRef.current.rotationY || 0);

        const project = (x: number, y: number, z: number) => {
          // Rotate around X
          const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
          const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
          // Rotate around Y
          const x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
          // Perspective
          const d = 300;
          const factor = d / (d + z1);
          return { x: x2 * factor, y: y1 * factor };
        };

        const vertices = [
          [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
          [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size]
        ];

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // Back face
          [4, 5], [5, 6], [6, 7], [7, 4], // Front face
          [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
        ];

        // Draw edges
        ctx.strokeStyle = "rgba(46, 140, 255, 0.4)";
        ctx.lineWidth = 1.5;
        edges.forEach(([u, v]) => {
          const p1 = project(vertices[u][0], vertices[u][1], vertices[u][2]);
          const p2 = project(vertices[v][0], vertices[v][1], vertices[v][2]);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw vertices as dimensions callout bubbles
        ctx.fillStyle = "var(--laser-green)";
        vertices.forEach((v, idx) => {
          if (idx === 1 || idx === 6) {
            const pt = project(v[0], v[1], v[2]);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Text callout
            ctx.strokeStyle = "rgba(0, 230, 118, 0.3)";
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x + 30, pt.y - 20);
            ctx.stroke();
            ctx.fillStyle = "rgba(0, 230, 118, 0.85)";
            ctx.font = "9px monospace";
            ctx.fillText(`L${idx}: ${((v[0] + size) * (1 + Math.sin(frame * 0.01) * 0.05)).toFixed(1)}mm`, pt.x + 35, pt.y - 18);
          }
        });

        ctx.restore();

        // Control prompt
        ctx.fillStyle = "rgba(184, 196, 208, 0.4)";
        ctx.font = "10px monospace";
        ctx.fillText("Interactive Parametric CAD Simulation (Drag or Move Mouse to rotate)", 15, h - 15);

      } else if (activeTopic.id === "cam") {
        // CAM CNC cutting path tracing
        const radius = 60;
        const centerX = w / 2;
        const centerY = h / 2;
        
        // Target path
        ctx.strokeStyle = "rgba(232, 135, 43, 0.25)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cut path drawn
        const progress = (frame % 200) / 200;
        const currentAngle = progress * Math.PI * 2;
        ctx.strokeStyle = "var(--forge-amber)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, currentAngle);
        ctx.stroke();

        // Active spindle tool
        const spindleX = centerX + Math.cos(currentAngle) * radius;
        const spindleY = centerY + Math.sin(currentAngle) * radius;

        // Spark emitter at tool contact
        if (Math.random() > 0.4) {
          particles.push({
            x: spindleX,
            y: spindleY,
            vx: (Math.random() - 0.5) * 4 + Math.cos(currentAngle + Math.PI/2) * 2,
            vy: (Math.random() - 0.5) * 4 + Math.sin(currentAngle + Math.PI/2) * 2,
            age: 0,
            maxAge: 25 + Math.random() * 20,
          });
        }

        // Draw Spindle
        ctx.fillStyle = "#1E2A35";
        ctx.strokeStyle = "var(--titanium)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(spindleX - 10, spindleY - 40);
        ctx.lineTo(spindleX + 10, spindleY - 40);
        ctx.lineTo(spindleX + 4, spindleY - 5);
        ctx.lineTo(spindleX, spindleY);
        ctx.lineTo(spindleX - 4, spindleY - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Spindle spin effect lines
        ctx.strokeStyle = "rgba(232, 135, 43, 0.4)";
        ctx.beginPath();
        ctx.arc(spindleX, spindleY - 20, 15, 0, Math.PI * 2);
        ctx.stroke();

        // CNC HUD overlay
        ctx.fillStyle = "var(--forge-amber)";
        ctx.font = "9px monospace";
        ctx.fillText(`CNC SPINDLE ACTIVE`, 20, 30);
        ctx.fillText(`FEEDRATE: F1200 mm/min`, 20, 45);
        ctx.fillText(`RPM: 18000 (S)`, 20, 60);
        ctx.fillText(`G-CODE: G02 X${spindleX.toFixed(1)} Y${spindleY.toFixed(1)} R${radius}`, 20, 75);

      } else if (activeTopic.id === "additive") {
        // Additive Layer deposition
        const printW = 160;
        const startY = h - 60;
        const currentLayer = Math.floor(frame / 60) % 8;
        const layerProgress = (frame % 60) / 60;

        // Draw printed base/bed
        ctx.fillStyle = "#14181E";
        ctx.fillRect(w/2 - printW/2 - 20, startY, printW + 40, 10);
        ctx.strokeStyle = "rgba(184, 196, 208, 0.2)";
        ctx.strokeRect(w/2 - printW/2 - 20, startY, printW + 40, 10);

        // Render fully solid layers
        ctx.fillStyle = "rgba(0, 230, 118, 0.25)";
        ctx.strokeStyle = "var(--laser-green)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < currentLayer; i++) {
          const ly = startY - (i + 1) * 8;
          ctx.fillRect(w/2 - printW/2, ly, printW, 7);
          ctx.strokeRect(w/2 - printW/2, ly, printW, 7);
        }

        // Active layer printing
        const activeY = startY - (currentLayer + 1) * 8;
        const currentPrintWidth = printW * layerProgress;
        ctx.fillStyle = "rgba(0, 230, 118, 0.4)";
        ctx.fillRect(w/2 - printW/2, activeY, currentPrintWidth, 7);
        ctx.strokeRect(w/2 - printW/2, activeY, currentPrintWidth, 7);

        // Printing Head (Nozzle)
        const nozzleX = w/2 - printW/2 + currentPrintWidth;
        const nozzleY = activeY - 5;

        // Melted green extrusion glow
        ctx.fillStyle = "var(--laser-green)";
        ctx.beginPath();
        ctx.arc(nozzleX, nozzleY + 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Laser/Heat beam to powder bed
        ctx.strokeStyle = "rgba(0, 230, 118, 0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nozzleX, nozzleY - 15);
        ctx.lineTo(nozzleX, nozzleY + 5);
        ctx.stroke();

        // Extruder Block
        ctx.fillStyle = "#1E2A35";
        ctx.strokeStyle = "var(--titanium)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(nozzleX - 15, nozzleY - 25);
        ctx.lineTo(nozzleX + 15, nozzleY - 25);
        ctx.lineTo(nozzleX + 5, nozzleY - 5);
        ctx.lineTo(nozzleX - 5, nozzleY - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Powder sparks/smoke particles
        if (Math.random() > 0.6) {
          particles.push({
            x: nozzleX,
            y: nozzleY + 5,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 2,
            age: 0,
            maxAge: 20 + Math.random() * 10,
          });
        }

        // HUD overlay
        ctx.fillStyle = "var(--laser-green)";
        ctx.font = "9px monospace";
        ctx.fillText(`3D PRINT BUILD CHAMBER`, 20, 30);
        ctx.fillText(`LAYER: ${currentLayer + 1} / 8`, 20, 45);
        ctx.fillText(`NOZZLE TEMP: 245°C`, 20, 60);
        ctx.fillText(`DEPOSITION SPEED: 80 mm/s`, 20, 75);

      } else if (activeTopic.id === "subtractive") {
        // Subtractive Milling Cutter
        const blockW = 180;
        const blockH = 60;
        const startX = w/2 - blockW/2;
        const startY = h/2 - blockH/2 + 20;

        // Draw original metal workpiece outline
        ctx.strokeStyle = "rgba(184, 196, 208, 0.15)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(startX, startY - 20, blockW, blockH + 20);
        ctx.setLineDash([]);

        // Cut path profile
        const cutterProgress = (frame % 220) / 220;
        const activeX = startX + blockW * cutterProgress;

        // Draw milled workpiece (with step cutout)
        ctx.fillStyle = "#1E2A35";
        ctx.strokeStyle = "rgba(184, 196, 208, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Left side uncut
        ctx.moveTo(startX, startY + blockH);
        ctx.lineTo(startX, startY);
        // Cut profile
        ctx.lineTo(activeX, startY);
        ctx.lineTo(activeX, startY + 20);
        ctx.lineTo(startX + blockW, startY + 20);
        // Right side
        ctx.lineTo(startX + blockW, startY + blockH);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Milling spindle cutter head
        const cutY = startY + 10;
        ctx.fillStyle = "rgba(232, 135, 43, 0.1)";
        ctx.strokeStyle = "var(--forge-amber)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(activeX, cutY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw tool bit
        ctx.fillStyle = "#14181E";
        ctx.strokeStyle = "var(--titanium)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(activeX - 6, cutY - 30);
        ctx.lineTo(activeX + 6, cutY - 30);
        ctx.lineTo(activeX + 6, cutY);
        ctx.lineTo(activeX - 6, cutY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shard particle emitter
        if (cutterProgress < 1.0) {
          if (Math.random() > 0.3) {
            particles.push({
              x: activeX,
              y: cutY,
              vx: (Math.random() - 0.2) * 5,
              vy: -Math.random() * 4 - 2,
              age: 0,
              maxAge: 30 + Math.random() * 20,
              type: "metal_chip"
            });
          }
        }

        // HUD overlay
        ctx.fillStyle = "var(--forge-amber)";
        ctx.font = "9px monospace";
        ctx.fillText(`SUBTRACTIVE MACHINING`, 20, 30);
        ctx.fillText(`DEPTH OF CUT (ap): 2.0 mm`, 20, 45);
        ctx.fillText(`SPINDLE ACTIVE: S6000 RPM`, 20, 60);

      } else if (activeTopic.id === "nonconventional") {
        // EDM Electrical Discharge Machining
        const gap = 12;
        const active = frame % 30 < 22; // Spark cycles
        const sparkCount = active ? Math.floor(Math.random() * 3) + 1 : 0;
        const workW = 200;
        const workH = 50;
        const workX = w/2 - workW/2;
        const workY = h/2 + 25;

        // Workpiece
        ctx.fillStyle = "#111820";
        ctx.strokeStyle = "rgba(184, 196, 208, 0.3)";
        ctx.lineWidth = 2;
        ctx.fillRect(workX, workY, workW, workH);
        ctx.strokeRect(workX, workY, workW, workH);

        // Tool Electrode
        const toolW = 60;
        const toolH = 50;
        const toolX = w/2 - toolW/2;
        const toolY = workY - gap - toolH;

        ctx.fillStyle = "rgba(46, 140, 255, 0.15)";
        ctx.strokeStyle = "var(--arc-blue)";
        ctx.fillRect(toolX, toolY, toolW, toolH);
        ctx.strokeRect(toolX, toolY, toolW, toolH);

        // Spark discharge in the gap
        if (active) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "var(--arc-blue)";
          ctx.shadowBlur = 15;

          for (let s = 0; s < sparkCount; s++) {
            const sx = toolX + 10 + Math.random() * (toolW - 20);
            ctx.beginPath();
            ctx.moveTo(sx, toolY + toolH);
            
            // Jagged spark line
            let cy = toolY + toolH;
            let cx = sx;
            while (cy < workY) {
              cy += 3;
              cx += (Math.random() - 0.5) * 6;
              ctx.lineTo(cx, cy);
            }
            ctx.stroke();

            // Bubble explosion at spark endpoint
            ctx.fillStyle = "rgba(46, 140, 255, 0.8)";
            ctx.beginPath();
            ctx.arc(cx, workY, 3, 0, Math.PI * 2);
            ctx.fill();
            
            if (Math.random() > 0.4) {
              particles.push({
                x: cx,
                y: workY,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 3,
                age: 0,
                maxAge: 15,
                color: "var(--arc-blue)"
              });
            }
          }
          // Reset shadow
          ctx.shadowBlur = 0;
        }

        // HUD overlay
        ctx.fillStyle = "var(--arc-blue)";
        ctx.font = "9px monospace";
        ctx.fillText(`EDM SPARK DISCHARGE`, 20, 30);
        ctx.fillText(`DIELECTRIC: Deionized Water`, 20, 45);
        ctx.fillText(`VOLTAGE: 80V PULSED`, 20, 60);

      } else if (activeTopic.id === "metrology") {
        // Laser Inspection sweep
        const startX = w/2 - 120;
        const endX = w/2 + 120;
        const laserSpeed = 0.015;
        const progress = (frame * laserSpeed) % 2;
        const currentX = progress < 1 
          ? startX + (endX - startX) * progress
          : endX - (endX - startX) * (progress - 1);

        // Draw part profile grid
        ctx.strokeStyle = "rgba(0, 230, 118, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let ix = startX; ix <= endX; ix += 20) {
          const hOffset = Math.sin((ix - w/2) * 0.05) * 20 + 30;
          ctx.moveTo(ix, h/2 - hOffset);
          ctx.lineTo(ix, h/2 + 50);
        }
        ctx.stroke();

        // Draw tested component envelope
        ctx.strokeStyle = "rgba(184, 196, 208, 0.3)";
        ctx.fillStyle = "rgba(30, 42, 53, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, h/2 + 50);
        for (let ix = startX; ix <= endX; ix += 10) {
          const hOffset = Math.sin((ix - w/2) * 0.05) * 20 + 30;
          ctx.lineTo(ix, h/2 - hOffset);
        }
        ctx.lineTo(endX, h/2 + 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Green scanning laser line
        const activeYOffset = Math.sin((currentX - w/2) * 0.05) * 20 + 30;
        const laserContactY = h/2 - activeYOffset;

        ctx.strokeStyle = "var(--laser-green)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "var(--laser-green)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(currentX, 20);
        ctx.lineTo(currentX, laserContactY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Laser reflection dot
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(currentX, laserContactY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Metrology CMM readout box
        ctx.fillStyle = "rgba(17, 24, 32, 0.85)";
        ctx.strokeStyle = "var(--laser-green)";
        ctx.lineWidth = 1;
        ctx.fillRect(w - 150, 20, 130, 80);
        ctx.strokeRect(w - 150, 20, 130, 80);

        ctx.fillStyle = "var(--laser-green)";
        ctx.font = "8px monospace";
        ctx.fillText(`CMM SCANNER DATA`, w - 140, 35);
        ctx.fillText(`X: ${currentX.toFixed(3)} mm`, w - 140, 50);
        ctx.fillText(`Y: ${laserContactY.toFixed(3)} mm`, w - 140, 62);
        ctx.fillText(`Z: 14.502 mm`, w - 140, 74);
        ctx.fillText(`DEV: +0.002 mm (OK)`, w - 140, 86);

      } else if (activeTopic.id === "welding") {
        // TIG Welding sparks and heat seam
        const startX = w/2 - 100;
        const endX = w/2 + 100;
        const weldY = h/2 + 10;
        const progress = (frame % 200) / 200;
        const currentX = startX + (endX - startX) * progress;

        // Base plates to join
        ctx.fillStyle = "#1E2A35";
        ctx.strokeStyle = "rgba(184, 196, 208, 0.4)";
        ctx.lineWidth = 1.5;
        // Plate 1
        ctx.fillRect(startX - 20, weldY - 30, 115, 60);
        ctx.strokeRect(startX - 20, weldY - 30, 115, 60);
        // Plate 2
        ctx.fillRect(startX + 105, weldY - 30, 115, 60);
        ctx.strokeRect(startX + 105, weldY - 30, 115, 60);

        // Heat zone (red/amber heat map expanding)
        ctx.strokeStyle = "rgba(232, 135, 43, 0.35)";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(startX, weldY);
        ctx.lineTo(currentX, weldY);
        ctx.stroke();

        // Melted weld bead
        ctx.strokeStyle = "rgba(184, 196, 208, 0.8)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, weldY);
        ctx.lineTo(currentX, weldY);
        ctx.stroke();
        ctx.lineCap = "butt";

        // Active torch flame and electrode
        if (progress < 1.0) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.shadowColor = "var(--arc-blue)";
          ctx.shadowBlur = 15;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(currentX, weldY - 20);
          ctx.lineTo(currentX, weldY);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Torch head
          ctx.fillStyle = "#14181E";
          ctx.strokeStyle = "var(--titanium)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(currentX - 8, weldY - 45);
          ctx.lineTo(currentX + 8, weldY - 45);
          ctx.lineTo(currentX + 3, weldY - 20);
          ctx.lineTo(currentX - 3, weldY - 20);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Welding sparks
          if (Math.random() > 0.2) {
            particles.push({
              x: currentX,
              y: weldY,
              vx: (Math.random() - 0.5) * 6,
              vy: -Math.random() * 5 - 1,
              age: 0,
              maxAge: 25 + Math.random() * 15,
              color: Math.random() > 0.4 ? "var(--arc-blue)" : "var(--forge-amber)"
            });
          }
        }

        // HUD overlay
        ctx.fillStyle = "var(--arc-blue)";
        ctx.font = "9px monospace";
        ctx.fillText(`TIG WELD DETECTED`, 20, 30);
        ctx.fillText(`AMPERAGE: 110 A`, 20, 45);
        ctx.fillText(`SHIELDING GAS: Ar 100%`, 20, 60);

      } else if (activeTopic.id === "composite") {
        // Composite laminate ply stacking
        const startX = w/2 - 80;
        const startY = h/2 - 60;
        const plyW = 160;
        const plyH = 12;

        const maxLayers = 4;
        const currentMax = Math.floor(frame / 60) % maxLayers + 1;

        // Draw structural mold
        ctx.fillStyle = "#0A0E17";
        ctx.strokeStyle = "rgba(184, 196, 208, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX - 20, startY + maxLayers * 15 + 15);
        ctx.lineTo(startX + plyW + 20, startY + maxLayers * 15 + 15);
        ctx.stroke();

        // Render carbon fiber plies
        for (let l = 0; l < currentMax; l++) {
          const ly = startY + l * 15;
          
          // Outer carbon fiber weave look
          ctx.fillStyle = "rgba(20, 24, 30, 0.9)";
          ctx.strokeStyle = l === currentMax - 1 ? "var(--forge-amber)" : "rgba(184, 196, 208, 0.25)";
          ctx.lineWidth = 1.5;
          ctx.fillRect(startX, ly, plyW, plyH);
          ctx.strokeRect(startX, ly, plyW, plyH);

          // Weave fiber grid lines inside card
          ctx.strokeStyle = "rgba(184, 196, 208, 0.08)";
          ctx.lineWidth = 1;
          const fiberSpacing = 8;
          ctx.beginPath();
          // Angle shifts per layer (0, 45, 90, -45 degree layup)
          const angle = l === 0 ? 0 : l === 1 ? 45 : l === 2 ? 90 : -45;
          if (angle === 0) {
            for (let f = startX + 5; f < startX + plyW; f += fiberSpacing) {
              ctx.moveTo(f, ly);
              ctx.lineTo(f, ly + plyH);
            }
          } else if (angle === 90) {
            for (let f = ly + 2; f < ly + plyH; f += 3) {
              ctx.moveTo(startX, f);
              ctx.lineTo(startX + plyW, f);
            }
          } else {
            // Draw diagonal crosses
            for (let f = startX - 10; f < startX + plyW; f += fiberSpacing) {
              ctx.moveTo(f, ly);
              ctx.lineTo(f + 15, ly + plyH);
            }
          }
          ctx.stroke();

          // Label angle tag
          ctx.fillStyle = l === currentMax - 1 ? "var(--forge-amber)" : "rgba(184, 196, 208, 0.4)";
          ctx.font = "8px monospace";
          ctx.fillText(`Ply ${l+1}: [${angle}°]`, startX + plyW + 10, ly + 9);
        }

        // HUD overlay
        ctx.fillStyle = "var(--forge-amber)";
        ctx.font = "9px monospace";
        ctx.fillText(`CARBON COMPOSITE LAYUP`, 20, 30);
        ctx.fillText(`ORIENTATION: [0/45/90/-45]s`, 20, 45);
        ctx.fillText(`LAMINATE THICKNESS: ${(currentMax * 0.125).toFixed(3)} mm`, 20, 60);

      } else if (activeTopic.id === "fem") {
        // FEM structural deformation mesh
        const centerX = w/2;
        const centerY = h/2;
        const meshSize = 5;
        const spacing = 30;

        const maxForce = 25;
        const currentForce = Math.sin(frame * 0.05) * maxForce; // Pulsing force

        ctx.save();
        ctx.translate(centerX - (meshSize - 1) * spacing / 2, centerY - (meshSize - 1) * spacing / 2);

        // Nodes coordinates deformed by force
        const getDeformedCoords = (col: number, row: number) => {
          const originalX = col * spacing;
          const originalY = row * spacing;

          // Apply displacement towards bottom-right based on force and proximity
          const distToTopLeft = Math.sqrt(col * col + row * row);
          const displacementFactor = distToTopLeft / (meshSize * 1.5);
          
          const dx = currentForce * displacementFactor * 0.8;
          const dy = currentForce * displacementFactor * 0.9;

          return { x: originalX + dx, y: originalY + dy, displacement: distToTopLeft * Math.abs(currentForce) };
        };

        // Draw deformed mesh cells with Heatmap fills
        for (let r = 0; r < meshSize - 1; r++) {
          for (let c = 0; c < meshSize - 1; c++) {
            const p00 = getDeformedCoords(c, r);
            const p10 = getDeformedCoords(c + 1, r);
            const p11 = getDeformedCoords(c + 1, r + 1);
            const p01 = getDeformedCoords(c, r + 1);

            // Average displacement determines cell stress color
            const avgDisp = (p00.displacement + p10.displacement + p11.displacement + p01.displacement) / 4;
            const stressRatio = Math.min(avgDisp / 80, 1);

            // Interpolate color from Low stress (blue) to High stress (red)
            // Low: rgb(21, 101, 192), High: rgb(255, 23, 68)
            const red = Math.floor(21 + (255 - 21) * stressRatio);
            const green = Math.floor(101 + (23 - 101) * stressRatio);
            const blue = Math.floor(192 + (68 - 192) * stressRatio);

            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.25)`;
            ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, 0.65)`;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(p00.x, p00.y);
            ctx.lineTo(p10.x, p10.y);
            ctx.lineTo(p11.x, p11.y);
            ctx.lineTo(p01.x, p01.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }

        // Draw force arrow on bottom-right node
        const pForce = getDeformedCoords(meshSize - 1, meshSize - 1);
        ctx.strokeStyle = "var(--stress-red)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pForce.x + 30, pForce.y + 30);
        ctx.lineTo(pForce.x, pForce.y);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = "var(--stress-red)";
        ctx.beginPath();
        ctx.moveTo(pForce.x, pForce.y);
        ctx.lineTo(pForce.x + 8, pForce.y + 2);
        ctx.lineTo(pForce.x + 2, pForce.y + 8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // HUD overlay
        ctx.fillStyle = "var(--stress-red)";
        ctx.font = "9px monospace";
        ctx.fillText(`FEM THERMO-STRUCTURAL SOLVER`, 20, 30);
        ctx.fillText(`LOAD VECTOR: ${currentForce.toFixed(2)} kN`, 20, 45);
        ctx.fillText(`MAX VON MISES STRESS: ${(Math.abs(currentForce) * 12.4).toFixed(1)} MPa`, 20, 60);

      } else if (activeTopic.id === "materials") {
        // Crystalline lattice structure simulation
        const nodes: { x: number; y: number }[] = [];
        const numNodes = 12;
        const centerX = w / 2;
        const centerY = h / 2;
        const latticeRadius = 70;

        for (let i = 0; i < numNodes; i++) {
          const angle = (i / numNodes) * Math.PI * 2 + (frame * 0.004);
          const orbitalShift = Math.sin(frame * 0.02 + i) * 8;
          const rad = latticeRadius + orbitalShift;
          nodes.push({
            x: centerX + Math.cos(angle) * rad,
            y: centerY + Math.sin(angle) * rad,
          });
        }

        // Connect lattice nodes
        ctx.strokeStyle = "rgba(0, 230, 118, 0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < numNodes; i++) {
          for (let j = i + 1; j < numNodes; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            // Draw atomic bond if close enough
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw central core atom
        ctx.fillStyle = "rgba(46, 140, 255, 0.15)";
        ctx.strokeStyle = "var(--arc-blue)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "var(--arc-blue)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw orbital nodes
        nodes.forEach((n, idx) => {
          ctx.fillStyle = idx % 3 === 0 ? "var(--laser-green)" : "var(--titanium)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // HUD overlay
        ctx.fillStyle = "var(--laser-green)";
        ctx.font = "9px monospace";
        ctx.fillText(`TITANIUM CRYSTAL LATTICE (HCP)`, 20, 30);
        ctx.fillText(`DISLOCATION DENSITY: 10^12 m^-2`, 20, 45);
        ctx.fillText(`GRAIN SIZE: ASTM 8.5`, 20, 60);
      }

      // Draw active sparks/particles in simulator
      particles.forEach((p) => {
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        
        // chip particles bounce or spin
        if (p.type === "metal_chip") {
          p.vy += 0.25; // Gravity
        }

        const lifeRatio = 1 - p.age / p.maxAge;
        ctx.fillStyle = p.color || (activeTopic.id === "additive" 
          ? `rgba(0, 230, 118, ${lifeRatio})`
          : activeTopic.id === "cam"
          ? `rgba(232, 135, 43, ${lifeRatio})`
          : `rgba(255, 255, 255, ${lifeRatio})`);

        ctx.beginPath();
        if (p.type === "metal_chip") {
          // Irregular rectangle shards
          ctx.rect(p.x, p.y, 3 * lifeRatio, 2 * lifeRatio);
        } else {
          ctx.arc(p.x, p.y, 2 * lifeRatio, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // Clear aged particles
      particles = particles.filter((p) => p.age < p.maxAge);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [activeTopic]);

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[250px_1fr]">
      {/* Course Sidebar selector */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[550px] scrollbar-none">
        <SectionLabel color="blue" className="mb-2">Course Modules</SectionLabel>
        {topics.map((topic) => {
          const Icon = topic.icon;
          const isActive = activeTopic.id === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className={[
                "flex items-center gap-3 w-full rounded-md border p-3.5 text-left transition-all duration-300",
                isActive
                  ? "border-[var(--arc-blue)] bg-[var(--arc-blue-dim)] text-white shadow-[var(--shadow-glow-blue)]"
                  : "border-[var(--edge)] bg-[var(--panel)]/40 text-[var(--ceramic-muted)] hover:border-[var(--edge-hover)] hover:text-white"
              ].join(" ")}
            >
              <Icon className={[
                "size-5 shrink-0 transition-transform duration-300",
                isActive ? "text-[var(--arc-blue)] scale-110" : "text-[var(--ceramic-muted)]"
              ].join(" ")} />
              <div>
                <p className="font-display text-sm font-semibold">{topic.name}</p>
                <p className="font-mono text-[10px] tracking-wider opacity-60 mt-0.5">{topic.code}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Media display viewport */}
      <GlassCard className="flex flex-col h-[550px] overflow-hidden">
        {/* VIEWPORT HEADER */}
        <div className="flex flex-wrap items-center justify-between border-b border-[var(--edge)] pb-3">
          <div>
            <span className="rounded bg-[var(--arc-blue-dim)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--arc-blue)]">
              {activeTopic.code}
            </span>
            <h2 className="font-display text-xl font-bold text-white mt-1">
              {activeTopic.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[var(--laser-green)] animate-pulse" />
            <span className="font-mono text-xs text-[var(--laser-green)]">SIMULATOR ACTIVE</span>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="relative flex-1 bg-[var(--void-deep)]/90 overflow-hidden">
          {/* USER ASSETS INTEGRATION VIEWPORT */}
          {userVideo ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <video
                src={userVideo}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute top-3 left-3 bg-black/70 border border-[var(--edge)] px-2.5 py-1 rounded text-xs font-mono text-[var(--arc-blue)]">
                [LIVE VIDEO FEED: public/media/videos/{activeTopic.id}.mp4]
              </div>
            </div>
          ) : userPhoto ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <img
                src={userPhoto}
                className="h-full w-full object-cover"
                alt={activeTopic.name}
              />
              <div className="absolute top-3 left-3 bg-black/70 border border-[var(--edge)] px-2.5 py-1 rounded text-xs font-mono text-[var(--arc-blue)]">
                [LIVE PHOTO LOADED: public/media/photos/{activeTopic.id}.jpg]
              </div>
            </div>
          ) : (
            // Default gorgeous canvas simulator fallbacks
            <canvas
              ref={canvasRef}
              className="h-full w-full cursor-crosshair"
              onMouseMove={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                
                if (activeTopic.id === "cad") {
                  interactiveStateRef.current = {
                    ...interactiveStateRef.current,
                    rotationX: (my / canvas.height) * Math.PI * 2,
                    rotationY: (mx / canvas.width) * Math.PI * 2,
                  };
                }
              }}
            />
          )}

          {/* Futuristic Overlay HUD labels */}
          <div className="absolute bottom-4 right-4 z-20 glass rounded p-3 text-[10px] font-mono text-[var(--ceramic-muted)] max-w-[200px]">
            <p className="font-bold text-white border-b border-[var(--edge)] pb-1 mb-1">METRIC MONITOR</p>
            <p>SAMPLE ID: IIST-MT-{activeTopic.id.toUpperCase()}-2026</p>
            <p>PRECISION: ±0.0025 mm</p>
            <p>STATUS: VERIFIED BY LAB</p>
          </div>
        </div>

        {/* TOPIC CURRICULUM SYNOPSIS */}
        <div className="border-t border-[var(--edge)] pt-3 mt-auto p-2 bg-[var(--panel)]/50">
          <p className="text-sm text-[var(--ceramic-muted)] leading-relaxed">
            {activeTopic.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeTopic.details.map((detail) => (
              <span 
                key={detail}
                className="flex items-center gap-1.5 rounded-full border border-[var(--edge)] bg-[var(--void)] px-2.5 py-0.5 text-xs text-[var(--ceramic-muted)]"
              >
                <CheckCircle className="size-3 text-[var(--laser-green)]" />
                {detail}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
