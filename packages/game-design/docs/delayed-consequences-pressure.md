# Design Note: Delayed Consequence and Pressure Scenes

Status: Exploratory  
Area: Narrative Design / Content Authoring  
Technical level: Light  
Current implementation approach: Use flags / boolean properties and authored follow-up scenes

## Summary

Delayed consequence is the design pattern where a player choice does not fully resolve in the moment.

Instead, the choice leaves a mark on the world, an NPC, a relationship, or a pressure. That mark later changes what scenes appear, how people behave, or what options are available.

The goal is to make the player feel:

> “The world remembered what I did.”

This does not require a complex consequence engine yet. For now, most delayed consequence can be authored with simple flags.

Use the flags, dude.

---

## Why Delayed Consequence Matters

Immediate feedback tells the player their action mattered.

Delayed consequence tells the player the world is alive.

A weak loop:

```text
Choice → number changes → move on