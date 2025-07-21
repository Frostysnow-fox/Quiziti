// Question Generator for all chapters
// This generates comprehensive questions for each chapter

export const generateAllQuestions = () => {
  const allQuestions = [];
  
  // Define comprehensive subjects and chapters structure
  const subjects = {
    "Basic Electronics": [
      "Semiconductors", "Diodes", "Transistors", "Amplifiers",
      "Power Supplies", "Circuit Analysis", "Electronic Components", "Measurement Techniques"
    ],
    "Digital Electronics": [
      "Logic Gates", "Boolean Algebra", "Flip Flops", "Counters",
      "Registers", "Multiplexers", "Decoders", "Memory Systems"
    ],
    "Analog Electronics": [
      "Op-Amps", "Oscillators", "Filters", "Power Amplifiers",
      "Signal Processing", "Feedback Systems", "Modulation", "Communication Systems"
    ],
    "Microprocessors": [
      "8085 Architecture", "Instruction Set", "Programming", "Interfacing",
      "Memory Systems", "I/O Operations", "Interrupts", "Applications"
    ],
    "Control Systems": [
      "System Modeling", "Transfer Functions", "Stability Analysis", "Root Locus",
      "Frequency Response", "PID Controllers", "State Space", "Digital Control"
    ],
    "Power Electronics": [
      "Power Diodes", "Thyristors", "Power MOSFETs", "Inverters",
      "Converters", "Motor Drives", "Power Quality", "Renewable Energy"
    ]
  };

  // Question templates for different chapters
  const questionTemplates = {
    // Diodes
    "Diodes": [
      {
        questionText: "Half-wave rectifier utilizes what percentage of input AC cycle?",
        options: ["25%", "50%", "75%", "100%"],
        correctOptionIndex: 1,
        explanation: "Half-wave rectifier uses only one half (50%) of AC input cycle."
      },
      {
        questionText: "Full-wave rectifier efficiency is approximately:",
        options: ["40.6%", "60.8%", "81.2%", "100%"],
        correctOptionIndex: 2,
        explanation: "Full-wave rectifier has maximum efficiency of 81.2%."
      },
      {
        questionText: "Bridge rectifier uses how many diodes?",
        options: ["1", "2", "3", "4"],
        correctOptionIndex: 3,
        explanation: "Bridge rectifier uses 4 diodes in bridge configuration."
      },
      {
        questionText: "Center-tap rectifier requires:",
        options: ["1 diode", "2 diodes", "3 diodes", "4 diodes"],
        correctOptionIndex: 1,
        explanation: "Center-tap full-wave rectifier uses 2 diodes."
      },
      {
        questionText: "PIV for bridge rectifier diode is:",
        options: ["Vm", "2Vm", "Vm/2", "√2Vm"],
        correctOptionIndex: 0,
        explanation: "Each diode in bridge rectifier has PIV = Vm."
      },
      {
        questionText: "Ripple factor of half-wave rectifier:",
        options: ["0.48", "1.21", "0.81", "2.42"],
        correctOptionIndex: 1,
        explanation: "Half-wave rectifier has ripple factor of 1.21."
      },
      {
        questionText: "Filter capacitor is connected:",
        options: ["In series with load", "In parallel with load", "In series with diode", "Across input"],
        correctOptionIndex: 1,
        explanation: "Filter capacitor is connected in parallel with load."
      },
      {
        questionText: "Transformer utilization factor is highest for:",
        options: ["Half-wave", "Center-tap", "Bridge", "All equal"],
        correctOptionIndex: 2,
        explanation: "Bridge rectifier has highest transformer utilization factor."
      },
      {
        questionText: "Rectifier converts:",
        options: ["AC to DC", "DC to AC", "AC to AC", "DC to DC"],
        correctOptionIndex: 0,
        explanation: "Rectifier converts alternating current to direct current."
      },
      {
        questionText: "Form factor of half-wave rectified output:",
        options: ["1.11", "1.57", "2.22", "3.14"],
        correctOptionIndex: 1,
        explanation: "Form factor of half-wave rectified sine wave is π/2 = 1.57."
      }
    ],

    // Zener Diodes
    "Zener Diodes": [
      {
        questionText: "Zener diode is used in:",
        options: ["Forward bias", "Reverse bias", "Both bias", "Zero bias"],
        correctOptionIndex: 1,
        explanation: "Zener diode operates in reverse bias for voltage regulation."
      },
      {
        questionText: "Zener breakdown occurs due to:",
        options: ["Thermal effect", "Avalanche effect", "Electric field effect", "All of above"],
        correctOptionIndex: 2,
        explanation: "Zener breakdown occurs due to strong electric field in depletion region."
      },
      {
        questionText: "Zener voltage remains:",
        options: ["Variable", "Constant", "Increasing", "Decreasing"],
        correctOptionIndex: 1,
        explanation: "Zener voltage remains approximately constant in breakdown region."
      },
      {
        questionText: "Temperature coefficient of Zener voltage below 5V is:",
        options: ["Positive", "Negative", "Zero", "Infinite"],
        correctOptionIndex: 1,
        explanation: "Zener diodes below 5V have negative temperature coefficient."
      },
      {
        questionText: "Zener diode symbol has:",
        options: ["Straight line", "Curved line", "Bent line", "Dotted line"],
        correctOptionIndex: 2,
        explanation: "Zener diode symbol has bent line at cathode end."
      },
      {
        questionText: "Minimum current to maintain Zener action:",
        options: ["Holding current", "Knee current", "Zener current", "Breakdown current"],
        correctOptionIndex: 1,
        explanation: "Knee current is minimum current to maintain Zener breakdown."
      },
      {
        questionText: "Zener diode acts as:",
        options: ["Amplifier", "Oscillator", "Voltage regulator", "Current regulator"],
        correctOptionIndex: 2,
        explanation: "Zener diode primarily acts as voltage regulator."
      },
      {
        questionText: "Series resistance with Zener diode:",
        options: ["Increases regulation", "Decreases regulation", "Limits current", "Increases voltage"],
        correctOptionIndex: 2,
        explanation: "Series resistance limits current through Zener diode."
      },
      {
        questionText: "Zener impedance is:",
        options: ["Very high", "Very low", "Medium", "Infinite"],
        correctOptionIndex: 1,
        explanation: "Zener diode has very low dynamic impedance in breakdown."
      },
      {
        questionText: "Power rating of Zener diode depends on:",
        options: ["Voltage only", "Current only", "Both V and I", "Temperature only"],
        correctOptionIndex: 2,
        explanation: "Power rating P = VZ × IZ depends on both voltage and current."
      }
    ],

    // Semiconductors
    "Semiconductors": [
      {
        questionText: "Pure silicon at room temperature acts as:",
        options: ["Conductor", "Insulator", "Semiconductor", "Superconductor"],
        correctOptionIndex: 1,
        explanation: "Pure silicon at room temperature has very few free electrons, acting as an insulator."
      },
      {
        questionText: "Doping silicon with phosphorus creates:",
        options: ["P-type", "N-type", "Intrinsic", "Compound"],
        correctOptionIndex: 1,
        explanation: "Phosphorus has 5 valence electrons, providing extra electrons (N-type)."
      },
      {
        questionText: "Energy gap of silicon is approximately:",
        options: ["0.7 eV", "1.1 eV", "1.4 eV", "3.2 eV"],
        correctOptionIndex: 1,
        explanation: "Silicon has an energy gap of approximately 1.1 eV."
      },
      {
        questionText: "Majority carriers in P-type semiconductor:",
        options: ["Electrons", "Holes", "Protons", "Neutrons"],
        correctOptionIndex: 1,
        explanation: "In P-type semiconductor, holes are majority carriers."
      },
      {
        questionText: "Fermi level in N-type semiconductor is:",
        options: ["Near valence band", "Near conduction band", "At center", "Outside bands"],
        correctOptionIndex: 1,
        explanation: "In N-type, Fermi level is closer to conduction band."
      }
    ],

    // Logic Gates
    "Logic Gates": [
      {
        questionText: "AND gate output is HIGH when:",
        options: ["Any input is HIGH", "All inputs are HIGH", "No input is HIGH", "One input is LOW"],
        correctOptionIndex: 1,
        explanation: "AND gate output is HIGH only when all inputs are HIGH."
      },
      {
        questionText: "OR gate with inputs A=0, B=1 gives output:",
        options: ["0", "1", "X", "Z"],
        correctOptionIndex: 1,
        explanation: "OR gate output is HIGH when any input is HIGH."
      },
      {
        questionText: "NOT gate is also called:",
        options: ["Buffer", "Inverter", "Amplifier", "Isolator"],
        correctOptionIndex: 1,
        explanation: "NOT gate inverts the input, hence called inverter."
      },
      {
        questionText: "NAND gate is equivalent to:",
        options: ["AND + OR", "AND + NOT", "OR + NOT", "XOR + NOT"],
        correctOptionIndex: 1,
        explanation: "NAND gate is AND gate followed by NOT gate."
      },
      {
        questionText: "Universal gates are:",
        options: ["AND, OR", "NAND, NOR", "XOR, XNOR", "NOT, BUFFER"],
        correctOptionIndex: 1,
        explanation: "NAND and NOR gates can implement any Boolean function."
      }
    ],

    // Op-Amps
    "Op-Amps": [
      {
        questionText: "Ideal op-amp has input impedance:",
        options: ["Zero", "Finite", "Infinite", "Unity"],
        correctOptionIndex: 2,
        explanation: "Ideal op-amp has infinite input impedance."
      },
      {
        questionText: "Op-amp in open loop has gain:",
        options: ["Unity", "Zero", "Very high", "Negative"],
        correctOptionIndex: 2,
        explanation: "Open loop gain of op-amp is typically 10^5 to 10^6."
      },
      {
        questionText: "Virtual short concept means:",
        options: ["Inputs are shorted", "V+ = V-", "Infinite current", "Zero voltage"],
        correctOptionIndex: 1,
        explanation: "In virtual short, both inputs are at same potential."
      },
      {
        questionText: "Inverting amplifier has gain:",
        options: ["Positive", "Negative", "Zero", "Infinite"],
        correctOptionIndex: 1,
        explanation: "Inverting amplifier produces 180° phase shift (negative gain)."
      },
      {
        questionText: "Slew rate is measured in:",
        options: ["V/s", "V/μs", "A/s", "Hz"],
        correctOptionIndex: 1,
        explanation: "Slew rate is maximum rate of change of output voltage (V/μs)."
      }
    ],

    "Transistors": [
      {
        questionText: "BJT stands for:",
        options: ["Binary Junction Transistor", "Bipolar Junction Transistor", "Bi-directional Junction Transistor", "Base Junction Transistor"],
        correctOptionIndex: 1,
        explanation: "BJT stands for Bipolar Junction Transistor."
      },
      {
        questionText: "BJT has how many terminals?",
        options: ["2", "3", "4", "5"],
        correctOptionIndex: 1,
        explanation: "BJT has three terminals: Base, Collector, and Emitter."
      },
      {
        questionText: "BJT is a:",
        options: ["Voltage controlled device", "Current controlled device", "Power controlled device", "Temperature controlled device"],
        correctOptionIndex: 1,
        explanation: "BJT is a current controlled device where base current controls collector current."
      },
      {
        questionText: "BJT has how many P-N junctions?",
        options: ["1", "2", "3", "4"],
        correctOptionIndex: 1,
        explanation: "BJT has two P-N junctions: Base-Emitter and Base-Collector."
      },
      {
        questionText: "In active region, BE junction is:",
        options: ["Forward biased", "Reverse biased", "Zero biased", "Unbiased"],
        correctOptionIndex: 0,
        explanation: "In active region, BE junction is forward biased."
      },
      {
        questionText: "In active region, BC junction is:",
        options: ["Forward biased", "Reverse biased", "Zero biased", "Unbiased"],
        correctOptionIndex: 1,
        explanation: "In active region, BC junction is reverse biased."
      },
      {
        questionText: "Most lightly doped region in BJT:",
        options: ["Emitter", "Base", "Collector", "All equal"],
        correctOptionIndex: 1,
        explanation: "Base is most lightly doped region in BJT."
      },
      {
        questionText: "Largest region in BJT:",
        options: ["Emitter", "Base", "Collector", "All equal"],
        correctOptionIndex: 2,
        explanation: "Collector is the largest region in BJT."
      },
      {
        questionText: "BJT amplifies:",
        options: ["Voltage only", "Current only", "Power only", "All three"],
        correctOptionIndex: 3,
        explanation: "BJT can amplify voltage, current, and power."
      },
      {
        questionText: "Common configurations of BJT:",
        options: ["2", "3", "4", "5"],
        correctOptionIndex: 1,
        explanation: "BJT has 3 configurations: CE, CB, and CC."
      }
    ],

    // Boolean Algebra
    "Boolean Algebra": [
      {
        questionText: "A + A' equals:",
        options: ["0", "1", "A", "A'"],
        correctOptionIndex: 1,
        explanation: "A + A' = 1 (Complement law)"
      },
      {
        questionText: "A . A equals:",
        options: ["0", "1", "A", "A'"],
        correctOptionIndex: 2,
        explanation: "A . A = A (Idempotent law)"
      },
      {
        questionText: "De Morgan's law states:",
        options: ["(A+B)' = A'.B'", "(A.B)' = A'+B'", "Both", "Neither"],
        correctOptionIndex: 2,
        explanation: "De Morgan's laws: (A+B)' = A'.B' and (A.B)' = A'+B'"
      },
      {
        questionText: "A + 0 equals:",
        options: ["0", "1", "A", "A'"],
        correctOptionIndex: 2,
        explanation: "A + 0 = A (Identity law for OR)"
      },
      {
        questionText: "Duality principle exchanges:",
        options: ["0 and 1", "+ and .", "Both", "Variables"],
        correctOptionIndex: 2,
        explanation: "Duality exchanges 0↔1 and +↔."
      }
    ],

    // Amplifiers
    "Amplifiers": [
      {
        questionText: "Common emitter amplifier provides:",
        options: ["Voltage gain only", "Current gain only", "Both gains", "No gain"],
        correctOptionIndex: 2,
        explanation: "CE amplifier provides both voltage and current gain."
      },
      {
        questionText: "Input impedance of CE amplifier is:",
        options: ["Very high", "Very low", "Medium", "Infinite"],
        correctOptionIndex: 2,
        explanation: "CE amplifier has medium input impedance."
      },
      {
        questionText: "Phase shift in CE amplifier is:",
        options: ["0°", "90°", "180°", "270°"],
        correctOptionIndex: 2,
        explanation: "CE amplifier provides 180° phase shift."
      },
      {
        questionText: "Emitter follower has gain:",
        options: [">>1", "<<1", "≈1", "=0"],
        correctOptionIndex: 2,
        explanation: "Emitter follower (CC) has voltage gain ≈ 1."
      },
      {
        questionText: "Bandwidth of amplifier is:",
        options: ["f1 - f2", "f2 - f1", "f1 + f2", "f1 × f2"],
        correctOptionIndex: 1,
        explanation: "Bandwidth = f2 - f1 (upper - lower cutoff frequency)"
      }
    ],

    // Microprocessor basics
    "8085 Architecture": [
      {
        questionText: "8085 is a:",
        options: ["4-bit processor", "8-bit processor", "16-bit processor", "32-bit processor"],
        correctOptionIndex: 1,
        explanation: "8085 is an 8-bit microprocessor."
      },
      {
        questionText: "8085 has how many address lines?",
        options: ["8", "16", "20", "24"],
        correctOptionIndex: 1,
        explanation: "8085 has 16 address lines (A0-A15)."
      },
      {
        questionText: "8085 can address maximum memory of:",
        options: ["64KB", "1MB", "16MB", "4GB"],
        correctOptionIndex: 0,
        explanation: "With 16 address lines, 8085 can address 2^16 = 64KB."
      },
      {
        questionText: "8085 operates at clock frequency:",
        options: ["1 MHz", "3 MHz", "5 MHz", "8 MHz"],
        correctOptionIndex: 1,
        explanation: "8085 typically operates at 3 MHz."
      },
      {
        questionText: "Program counter in 8085 is:",
        options: ["8-bit", "16-bit", "20-bit", "32-bit"],
        correctOptionIndex: 1,
        explanation: "Program counter is 16-bit to address 64KB memory."
      }
    ],

    // Add default questions for chapters without specific templates
    "default": [
      {
        questionText: "What is the primary function of this chapter's concepts?",
        options: ["Processing", "Storage", "Control", "All of the above"],
        correctOptionIndex: 3,
        explanation: "Most electronic concepts involve processing, storage, and control functions."
      },
      {
        questionText: "Which parameter is most critical in this domain?",
        options: ["Voltage", "Current", "Power", "Frequency"],
        correctOptionIndex: 0,
        explanation: "Voltage is often the most fundamental parameter in electronics."
      },
      {
        questionText: "What is the typical application of these concepts?",
        options: ["Communication", "Control", "Processing", "All fields"],
        correctOptionIndex: 3,
        explanation: "Electronic concepts find applications across all fields."
      },
      {
        questionText: "Which factor affects performance most?",
        options: ["Temperature", "Frequency", "Design", "All factors"],
        correctOptionIndex: 3,
        explanation: "Performance is affected by multiple factors including temperature, frequency, and design."
      },
      {
        questionText: "What is the main advantage of modern implementations?",
        options: ["Speed", "Efficiency", "Reliability", "All advantages"],
        correctOptionIndex: 3,
        explanation: "Modern implementations typically offer improvements in speed, efficiency, and reliability."
      }
    ]
  };

  // Generate questions for each chapter
  Object.entries(subjects).forEach(([subject, chapters]) => {
    chapters.forEach(chapter => {
      // Use template if available, otherwise generate generic questions
      const template = questionTemplates[chapter];
      if (template) {
        template.forEach(q => {
          allQuestions.push({
            ...q,
            subject,
            chapter,
            authorId: "lecturer-001"
          });
        });
      } else {
        // Use default template for chapters without specific templates
        const defaultTemplate = questionTemplates.default;
        defaultTemplate.forEach((q) => {
          // Customize default questions with chapter-specific context
          let questionText = q.questionText.replace("this chapter's concepts", `${chapter} concepts`);
          questionText = questionText.replace("this domain", `${chapter}`);
          questionText = questionText.replace("these concepts", `${chapter} concepts`);

          let explanation = q.explanation.replace("Electronic concepts", `${chapter} concepts`);
          explanation = explanation.replace("Most electronic concepts", `Most ${chapter} concepts`);

          allQuestions.push({
            questionText: questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: explanation,
            subject,
            chapter,
            authorId: "lecturer-001"
          });
        });

        // Add 5 more generic questions to reach 10 per chapter
        for (let i = 6; i <= 10; i++) {
          allQuestions.push({
            questionText: `${chapter} - Advanced Question ${i-5}: What is an important aspect of ${chapter}?`,
            options: [
              `Primary characteristic of ${chapter}`,
              `Secondary feature of ${chapter}`,
              `Advanced concept in ${chapter}`,
              `All of the above`
            ],
            correctOptionIndex: 3,
            explanation: `This question covers advanced concepts of ${chapter} in ${subject}.`,
            subject,
            chapter,
            authorId: "lecturer-001"
          });
        }
      }
    });
  });

  return allQuestions;
};
