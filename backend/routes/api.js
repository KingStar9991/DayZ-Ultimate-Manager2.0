
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const SERVER_ROOT = process.env.DAYZ_SERVER_ROOT || path.resolve(__dirname, '..', '..', 'data', 'example-server');
let lastLogs = ['[INFO] Backend started','[INFO] Example log line'];
router.get('/status', (req, res) => { res.json({ server: { online:false, players:0, cpu:5, ramMb:12000 }, manager:{version:'2.0.0', utc:new Date().toISOString()} }); });
router.post('/server/start', async (req,res)=>{ lastLogs.unshift(`[${new Date().toISOString()}] START command issued (stub)`); res.json({ok:true,message:'Start queued (stub)'}); });
router.post('/server/stop', async (req,res)=>{ lastLogs.unshift(`[${new Date().toISOString()}] STOP command issued (stub)`); res.json({ok:true,message:'Stop queued (stub)'}); });
router.get('/logs', async (req,res)=>{ res.json({ logs: lastLogs.slice(0,500) }); });
router.post('/logs/append', async (req,res)=>{ const text = req.body.text||''; lastLogs.unshift(`[APPEND] ${text}`); res.json({ok:true}); });
router.get('/mods', async (req,res)=>{ try{ const files = await fs.readdir(SERVER_ROOT, { withFileTypes:true }); const mods = files.filter(f=>f.isDirectory() && f.name.startsWith('@')).map(d=>d.name); res.json({mods}); } catch(e){ res.json({mods:[],error:e.message}); } });
router.post('/mods/download', async (req,res)=>{ const { workshopId } = req.body; lastLogs.unshift(`[${new Date().toISOString()}] queued workshop download ${workshopId} (stub)`); res.json({ok:true,queued:workshopId}); });
router.get('/types', async (req,res)=>{ try{ const tpath = path.join(SERVER_ROOT,'mpmissions','dayzOffline.chernarusplus','types.xml'); const text = await fs.readFile(tpath,'utf8'); res.json({content:text}); } catch(e){ res.json({content:null,error:'types.xml not found. Replace path or add mission mpmissions/types.xml'}); } });
router.post('/types', async (req,res)=>{ try{ const tpath = path.join(SERVER_ROOT,'mpmissions','dayzOffline.chernarusplus','types.xml'); await fs.writeFile(tpath, req.body.content||'','utf8'); res.json({ok:true,path:tpath}); } catch(e){ res.json({ok:false,error:e.message}); } });
router.get('/heatmap/loot', async (req,res)=>{ const sample = [ [54.35,18.4,0.8],[54.36,18.42,0.9],[54.355,18.41,0.6],[54.33,18.45,0.3],[54.38,18.39,0.5] ]; res.json({points:sample}); });
router.get('/whoami', (req,res)=> res.json({user:'local',node:process.version}));
module.exports = router;
