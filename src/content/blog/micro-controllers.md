---
title: 'Microcontrollers'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 15 2022'
heroImage: '../../assets/blog-placeholder-4.jpg'
author: 'alex-rivera'
---
MCU – Microcontroller

Points:

    Small, low power; often battery operated.

    Generally ARM Cortex-M series (also Cortex-R).

    OS options: FreeRTOS, Contiki, uClinux, etc.

    Embedded applications: microwave, washing machine, car ECU, toys, medical devices.

    Self-contained: onboard flash and RAM.

    Tiny standby power (nano-amps).

    Real-time behavior.

    Single core, 8/16/32-bit (not 64-bit).

    Hobbyist options: Arduino, ESP32.

Concepts:

    Microcontroller (MCU):

        A small computer on a single chip, designed for embedded control.

        Includes CPU, memory (flash for code, RAM for data), and peripherals (timers, ADC, GPIO) on one chip.

    ARM Cortex-M / Cortex-R:

        Cortex-M: microcontroller profile, low power, deterministic behavior.

        Cortex-R: real-time profile, used where timing guarantees matter (e.g., automotive, storage controllers).

    Real-time:

        The system must respond within strict time limits (e.g., airbag deployment, motor control).

        Not necessarily “fast”, but predictable.

    Onboard flash & RAM:

        Flash: non-volatile storage for program code.

        RAM: volatile memory for runtime data.

        No separate hard drive; everything is on-chip or small external memory.

    Low power & nano-amp standby:

        Can sleep most of the time and wake on events (button press, sensor trigger).

        Critical for battery-powered devices (wearables, sensors).

    8/16/32-bit, not 64-bit:

        Data paths and registers are small; enough for control tasks.

        64-bit not needed; would waste power and cost.

    FreeRTOS, Contiki, uClinux:

        Lightweight operating systems / kernels for MCUs.

        Provide task scheduling, timers, basic I/O, but much smaller than desktop OSes.

    Arduino, ESP32:

        Popular hobbyist/dev boards based on MCUs.

        Arduino often uses AVR or ARM MCUs; ESP32 is a WiFi/BT-enabled MCU.

MCUs are the “brains” of everyday devices: they read sensors, control actuators, and implement simple logic.
