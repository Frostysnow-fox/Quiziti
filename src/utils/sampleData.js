// Sample data for QuizITI platform - TOPIC-FREE VERSION
// This file contains sample users and questions for testing
// Uses simplified Subject → Chapter structure only (NO TOPICS)

export const sampleUsers = [
  {
    uid: 'lecturer-001',
    email: 'lecturer@quiziti.com',
    name: 'Dr. Rajesh Kumar',
    role: 'lecturer'
  },
  {
    uid: 'student-001',
    email: 'student1@quiziti.com',
    name: 'Priya Sharma',
    role: 'student'
  },
  {
    uid: 'student-002',
    email: 'student2@quiziti.com',
    name: 'Arjun Patel',
    role: 'student'
  }
];

export const sampleQuestions = [
  // Basic Electronics - Semiconductors (10 questions)
  {
    questionText: "What is the main difference between a conductor and a semiconductor?",
    options: [
      "Conductors have more electrons than semiconductors",
      "Semiconductors have controllable conductivity while conductors have fixed high conductivity",
      "Conductors are always metals while semiconductors are always non-metals",
      "There is no significant difference between them"
    ],
    correctOptionIndex: 1,
    explanation: "Semiconductors have controllable conductivity that can be modified by adding impurities (doping), while conductors have fixed high conductivity.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "At absolute zero temperature, a pure semiconductor behaves as:",
    options: ["A conductor", "An insulator", "A superconductor", "A resistor"],
    correctOptionIndex: 1,
    explanation: "At absolute zero temperature, all electrons are in the valence band and none are available for conduction, making it behave as an insulator.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The process of adding impurities to pure semiconductor is called:",
    options: ["Diffusion", "Doping", "Ionization", "Recombination"],
    correctOptionIndex: 1,
    explanation: "Doping is the process of adding small amounts of impurities to pure semiconductors to modify their electrical properties.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "Silicon has an energy gap of approximately:",
    options: ["0.7 eV", "1.1 eV", "1.4 eV", "3.2 eV"],
    correctOptionIndex: 1,
    explanation: "Silicon has an energy gap of approximately 1.1 eV at room temperature.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which of the following is a commonly used semiconductor material?",
    options: ["Copper", "Silicon", "Gold", "Aluminum"],
    correctOptionIndex: 1,
    explanation: "Silicon is the most commonly used semiconductor material in electronic devices due to its excellent properties and abundance.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "Germanium belongs to which group in the periodic table?",
    options: ["Group III", "Group IV", "Group V", "Group VI"],
    correctOptionIndex: 1,
    explanation: "Germanium belongs to Group IV of the periodic table, having 4 valence electrons.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The majority carriers in P-type semiconductor are:",
    options: ["Electrons", "Holes", "Protons", "Neutrons"],
    correctOptionIndex: 1,
    explanation: "In P-type semiconductor, holes are the majority carriers due to acceptor impurities.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "What happens when a pure semiconductor is doped with phosphorus?",
    options: ["Becomes P-type", "Becomes N-type", "Remains intrinsic", "Becomes conductor"],
    correctOptionIndex: 1,
    explanation: "Phosphorus has 5 valence electrons, so when added to silicon (4 valence electrons), it provides extra electrons, making it N-type.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The forbidden energy gap in germanium is approximately:",
    options: ["0.67 eV", "1.1 eV", "1.4 eV", "3.2 eV"],
    correctOptionIndex: 0,
    explanation: "Germanium has an energy gap of approximately 0.67 eV at room temperature.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },
  {
    questionText: "In intrinsic semiconductors, the number of electrons equals:",
    options: ["Number of protons", "Number of holes", "Number of atoms", "Zero"],
    correctOptionIndex: 1,
    explanation: "In intrinsic semiconductors, electron-hole pairs are created equally, so ne = nh.",
    subject: "Basic Electronics",
    chapter: "Semiconductors",
    authorId: "lecturer-001"
  },

  // Basic Electronics - Diodes (10 questions)
  {
    questionText: "A diode primarily acts as:",
    options: ["An amplifier", "A switch", "A one-way valve for current", "A voltage regulator"],
    correctOptionIndex: 2,
    explanation: "A diode acts as a one-way valve for electric current, allowing current to flow in the forward direction and blocking it in the reverse direction.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is the typical forward voltage drop across a silicon diode?",
    options: ["0.3V", "0.7V", "1.4V", "2.1V"],
    correctOptionIndex: 1,
    explanation: "A silicon diode typically has a forward voltage drop of approximately 0.7V when conducting.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "In a half-wave rectifier circuit, what percentage of the input AC cycle is utilized?",
    options: ["25%", "50%", "75%", "100%"],
    correctOptionIndex: 1,
    explanation: "In a half-wave rectifier, only one half (50%) of the AC input cycle is utilized, while the other half is blocked by the diode.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "The reverse saturation current in a diode is typically:",
    options: ["Very high", "Moderate", "Very low", "Zero"],
    correctOptionIndex: 2,
    explanation: "The reverse saturation current in a diode is typically very low, in the range of microamperes or nanoamperes.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "A Zener diode is primarily used for:",
    options: ["Amplification", "Voltage regulation", "Current amplification", "Switching"],
    correctOptionIndex: 1,
    explanation: "Zener diodes are primarily used for voltage regulation due to their stable reverse breakdown voltage.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "The knee voltage of a germanium diode is approximately:",
    options: ["0.3V", "0.7V", "1.4V", "2.1V"],
    correctOptionIndex: 0,
    explanation: "Germanium diodes have a lower knee voltage of approximately 0.3V compared to silicon diodes.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "In a full-wave rectifier, the efficiency is approximately:",
    options: ["40.6%", "60.8%", "81.2%", "100%"],
    correctOptionIndex: 2,
    explanation: "The efficiency of a full-wave rectifier is approximately 81.2%, which is higher than a half-wave rectifier.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "A LED (Light Emitting Diode) operates in:",
    options: ["Reverse bias", "Forward bias", "Zero bias", "Any bias"],
    correctOptionIndex: 1,
    explanation: "LEDs operate in forward bias condition to emit light when current flows through them.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "The PIV (Peak Inverse Voltage) rating of a diode indicates:",
    options: ["Forward voltage", "Maximum reverse voltage", "Average voltage", "RMS voltage"],
    correctOptionIndex: 1,
    explanation: "PIV rating indicates the maximum reverse voltage a diode can withstand without breakdown.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },
  {
    questionText: "In a bridge rectifier, how many diodes are used?",
    options: ["1", "2", "4", "6"],
    correctOptionIndex: 2,
    explanation: "A bridge rectifier uses 4 diodes arranged in a bridge configuration for full-wave rectification.",
    subject: "Basic Electronics",
    chapter: "Diodes",
    authorId: "lecturer-001"
  },

  // Basic Electronics - Transistors (10 questions)
  {
    questionText: "How many terminals does a BJT (Bipolar Junction Transistor) have?",
    options: ["2", "3", "4", "5"],
    correctOptionIndex: 1,
    explanation: "A BJT has three terminals: Base (B), Collector (C), and Emitter (E).",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "In an NPN transistor, the current flow is primarily due to:",
    options: ["Holes", "Electrons", "Both equally", "Neither"],
    correctOptionIndex: 1,
    explanation: "In an NPN transistor, the majority carriers are electrons, and current flows due to electrons moving from emitter to collector.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The current gain (β) of a transistor is defined as:",
    options: ["IC/IB", "IE/IB", "IC/IE", "IB/IC"],
    correctOptionIndex: 0,
    explanation: "Current gain β (beta) is defined as the ratio of collector current to base current (IC/IB).",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "For a transistor to operate in active region:",
    options: ["Both junctions forward biased", "Both junctions reverse biased", "BE forward, BC reverse", "BE reverse, BC forward"],
    correctOptionIndex: 2,
    explanation: "For active region operation, base-emitter junction is forward biased and base-collector junction is reverse biased.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The input impedance of a common emitter amplifier is:",
    options: ["Very high", "Very low", "Medium", "Infinite"],
    correctOptionIndex: 2,
    explanation: "Common emitter amplifier has medium input impedance, typically in the range of few kilo-ohms.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which transistor configuration has highest voltage gain?",
    options: ["Common Base", "Common Emitter", "Common Collector", "All equal"],
    correctOptionIndex: 1,
    explanation: "Common emitter configuration provides the highest voltage gain among the three configurations.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The phase relationship between input and output in CE amplifier is:",
    options: ["0°", "90°", "180°", "270°"],
    correctOptionIndex: 2,
    explanation: "Common emitter amplifier provides 180° phase shift between input and output signals.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "A MOSFET is a:",
    options: ["Current controlled device", "Voltage controlled device", "Power controlled device", "Temperature controlled device"],
    correctOptionIndex: 1,
    explanation: "MOSFET (Metal Oxide Semiconductor Field Effect Transistor) is a voltage controlled device.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The saturation region of a transistor is used for:",
    options: ["Amplification", "Switching", "Oscillation", "Regulation"],
    correctOptionIndex: 1,
    explanation: "The saturation region is primarily used for switching applications where transistor acts as a closed switch.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },
  {
    questionText: "The typical value of current gain (β) for a small signal transistor is:",
    options: ["1-10", "50-300", "500-1000", "Above 1000"],
    correctOptionIndex: 1,
    explanation: "Small signal transistors typically have current gain (β) values ranging from 50 to 300.",
    subject: "Basic Electronics",
    chapter: "Transistors",
    authorId: "lecturer-001"
  },

  // Digital Electronics - Logic Gates (10 questions)
  {
    questionText: "What is the output of an AND gate when both inputs A and B are HIGH?",
    options: ["LOW", "HIGH", "Undefined", "Depends on supply voltage"],
    correctOptionIndex: 1,
    explanation: "An AND gate outputs HIGH (1) only when all inputs are HIGH. If both inputs are HIGH, the output is HIGH.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which logic gate is known as the 'universal gate'?",
    options: ["AND", "OR", "NAND", "XOR"],
    correctOptionIndex: 2,
    explanation: "NAND gate is called a universal gate because any other logic gate can be implemented using only NAND gates.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "The output of an OR gate is LOW when:",
    options: ["Any input is HIGH", "All inputs are HIGH", "All inputs are LOW", "One input is LOW"],
    correctOptionIndex: 2,
    explanation: "An OR gate output is LOW only when all inputs are LOW.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "A NOT gate is also called:",
    options: ["Buffer", "Inverter", "Amplifier", "Isolator"],
    correctOptionIndex: 1,
    explanation: "NOT gate inverts the input signal, hence it's called an inverter.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "The Boolean expression for NAND gate is:",
    options: ["A.B", "A+B", "(A.B)'", "(A+B)'"],
    correctOptionIndex: 2,
    explanation: "NAND gate is the complement of AND gate, so its expression is (A.B)'.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "XOR gate output is HIGH when:",
    options: ["Both inputs are same", "Both inputs are different", "Both inputs are HIGH", "Both inputs are LOW"],
    correctOptionIndex: 1,
    explanation: "XOR (Exclusive OR) gate output is HIGH when inputs are different from each other.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "How many input combinations are possible for a 3-input logic gate?",
    options: ["6", "8", "9", "12"],
    correctOptionIndex: 1,
    explanation: "For n inputs, there are 2^n possible combinations. For 3 inputs: 2^3 = 8 combinations.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "The other universal gate besides NAND is:",
    options: ["AND", "OR", "NOR", "XOR"],
    correctOptionIndex: 2,
    explanation: "NOR gate is also a universal gate as any Boolean function can be implemented using only NOR gates.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "A buffer gate:",
    options: ["Inverts the input", "Amplifies the input", "Delays the input", "Isolates circuits"],
    correctOptionIndex: 3,
    explanation: "A buffer gate provides isolation between circuits without changing the logic level.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },
  {
    questionText: "The truth table of which gate is exactly opposite to OR gate?",
    options: ["AND", "NAND", "NOR", "XOR"],
    correctOptionIndex: 2,
    explanation: "NOR gate truth table is exactly opposite to OR gate - it's the complement of OR gate.",
    subject: "Digital Electronics",
    chapter: "Logic Gates",
    authorId: "lecturer-001"
  },

  // Digital Electronics - Boolean Algebra (10 questions)
  {
    questionText: "According to De Morgan's theorem, (A·B)' equals:",
    options: ["A' + B'", "A' · B'", "A + B", "(A + B)'"],
    correctOptionIndex: 0,
    explanation: "De Morgan's theorem states that the complement of a product equals the sum of complements: (A·B)' = A' + B'",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is the result of A + A' in Boolean algebra?",
    options: ["0", "1", "A", "A'"],
    correctOptionIndex: 1,
    explanation: "According to the complement law in Boolean algebra, A + A' = 1. A variable ORed with its complement always equals 1.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "The Boolean expression A + 0 equals:",
    options: ["0", "1", "A", "A'"],
    correctOptionIndex: 2,
    explanation: "According to the identity law, A + 0 = A. ORing with 0 doesn't change the variable.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is A · A in Boolean algebra?",
    options: ["0", "1", "A", "A'"],
    correctOptionIndex: 2,
    explanation: "According to the idempotent law, A · A = A. ANDing a variable with itself gives the same variable.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "The dual of A + B is:",
    options: ["A · B", "A' + B'", "A + B'", "A' · B'"],
    correctOptionIndex: 0,
    explanation: "In duality, + is replaced by · and vice versa. So dual of A + B is A · B.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which law states that A + AB = A?",
    options: ["Commutative", "Associative", "Absorption", "Distributive"],
    correctOptionIndex: 2,
    explanation: "The absorption law states that A + AB = A and A(A + B) = A.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "The Boolean expression A · 1 equals:",
    options: ["0", "1", "A", "A'"],
    correctOptionIndex: 2,
    explanation: "According to the identity law, A · 1 = A. ANDing with 1 doesn't change the variable.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is (A')' in Boolean algebra?",
    options: ["A", "A'", "0", "1"],
    correctOptionIndex: 0,
    explanation: "According to the involution law, (A')' = A. Double complement gives back the original variable.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "The distributive law in Boolean algebra states:",
    options: ["A + BC = (A+B)(A+C)", "A(B+C) = AB + AC", "Both are correct", "Neither is correct"],
    correctOptionIndex: 2,
    explanation: "Both forms of distributive law are correct: A + BC = (A+B)(A+C) and A(B+C) = AB + AC.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is A + A·B simplified to?",
    options: ["A", "B", "A + B", "A·B"],
    correctOptionIndex: 0,
    explanation: "Using absorption law, A + A·B = A. The term A·B is absorbed by A.",
    subject: "Digital Electronics",
    chapter: "Boolean Algebra",
    authorId: "lecturer-001"
  },

  // Basic Electronics - Amplifiers (10 questions)
  {
    questionText: "The primary function of an amplifier is to:",
    options: ["Reduce signal amplitude", "Increase signal amplitude", "Filter signals", "Generate signals"],
    correctOptionIndex: 1,
    explanation: "An amplifier's primary function is to increase the amplitude of input signals while maintaining their waveform.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is the voltage gain of an amplifier with input 2V and output 20V?",
    options: ["5", "10", "15", "20"],
    correctOptionIndex: 1,
    explanation: "Voltage gain = Output voltage / Input voltage = 20V / 2V = 10.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which class of amplifier has the highest efficiency?",
    options: ["Class A", "Class B", "Class AB", "Class C"],
    correctOptionIndex: 3,
    explanation: "Class C amplifiers have the highest efficiency (up to 90%) but are used only for RF applications due to high distortion.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The bandwidth of an amplifier is defined as:",
    options: ["Maximum frequency", "Minimum frequency", "Frequency range with gain ≥ 0.707 of maximum", "Total frequency spectrum"],
    correctOptionIndex: 2,
    explanation: "Bandwidth is the frequency range where the gain is at least 70.7% (or -3dB) of the maximum gain.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Negative feedback in amplifiers:",
    options: ["Increases gain", "Decreases stability", "Improves stability and reduces distortion", "Increases noise"],
    correctOptionIndex: 2,
    explanation: "Negative feedback improves stability, reduces distortion, and increases bandwidth at the cost of reduced gain.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The input impedance of an ideal voltage amplifier should be:",
    options: ["Zero", "Very low", "Very high", "Equal to load impedance"],
    correctOptionIndex: 2,
    explanation: "An ideal voltage amplifier should have very high input impedance to avoid loading the source.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "What is the typical quiescent point (Q-point) for Class A amplifiers?",
    options: ["At cutoff", "At saturation", "At the center of load line", "At maximum power"],
    correctOptionIndex: 2,
    explanation: "Class A amplifiers are biased at the center of the load line for maximum linear operation.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The slew rate of an amplifier indicates:",
    options: ["Maximum voltage gain", "Maximum current gain", "Maximum rate of change of output voltage", "Maximum frequency response"],
    correctOptionIndex: 2,
    explanation: "Slew rate is the maximum rate at which the output voltage can change, typically measured in V/μs.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which amplifier configuration provides voltage gain but no current gain?",
    options: ["Common emitter", "Common base", "Common collector", "Differential amplifier"],
    correctOptionIndex: 1,
    explanation: "Common base configuration provides voltage gain but has current gain less than 1 (no current amplification).",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The total harmonic distortion (THD) in amplifiers should be:",
    options: ["As high as possible", "As low as possible", "Equal to 50%", "Equal to unity"],
    correctOptionIndex: 1,
    explanation: "THD should be as low as possible for high-fidelity amplification. Good amplifiers have THD < 1%.",
    subject: "Basic Electronics",
    chapter: "Amplifiers",
    authorId: "lecturer-001"
  },

  // Digital Electronics - Flip Flops (10 questions)
  {
    questionText: "A flip-flop is a:",
    options: ["Combinational circuit", "Sequential circuit", "Memory device", "Both sequential circuit and memory device"],
    correctOptionIndex: 3,
    explanation: "A flip-flop is both a sequential circuit (output depends on current and past inputs) and a memory device (stores 1 bit).",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "How many stable states does a flip-flop have?",
    options: ["1", "2", "3", "4"],
    correctOptionIndex: 1,
    explanation: "A flip-flop has two stable states, representing binary 0 and 1, making it a bistable device.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which flip-flop is also known as a 'toggle' flip-flop?",
    options: ["SR flip-flop", "D flip-flop", "JK flip-flop", "T flip-flop"],
    correctOptionIndex: 3,
    explanation: "T (Toggle) flip-flop changes its output state on each clock pulse when T=1.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "What happens when both S and R inputs of an SR flip-flop are HIGH?",
    options: ["Output becomes 0", "Output becomes 1", "Output toggles", "Forbidden/Invalid state"],
    correctOptionIndex: 3,
    explanation: "When both S=1 and R=1 in an SR flip-flop, it creates a forbidden or invalid state that should be avoided.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "A D flip-flop is also called:",
    options: ["Data flip-flop", "Delay flip-flop", "Both data and delay flip-flop", "Toggle flip-flop"],
    correctOptionIndex: 2,
    explanation: "D flip-flop is called both Data flip-flop (stores data) and Delay flip-flop (delays input by one clock cycle).",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "The main advantage of JK flip-flop over SR flip-flop is:",
    options: ["Higher speed", "Lower power consumption", "No invalid state", "Simpler design"],
    correctOptionIndex: 2,
    explanation: "JK flip-flop eliminates the invalid state problem of SR flip-flop by toggling when J=K=1.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "Edge-triggered flip-flops change state:",
    options: ["When clock is HIGH", "When clock is LOW", "On rising or falling edge of clock", "Continuously"],
    correctOptionIndex: 2,
    explanation: "Edge-triggered flip-flops change state only on the rising edge or falling edge of the clock signal.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "Master-slave flip-flop is used to:",
    options: ["Increase speed", "Reduce power", "Eliminate race conditions", "Increase fan-out"],
    correctOptionIndex: 2,
    explanation: "Master-slave configuration eliminates race conditions by using two flip-flops in cascade.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "The setup time of a flip-flop is:",
    options: ["Time after clock edge when input must be stable", "Time before clock edge when input must be stable", "Clock pulse width", "Propagation delay"],
    correctOptionIndex: 1,
    explanation: "Setup time is the minimum time before the clock edge that the input must be stable for reliable operation.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which flip-flop can be used to build a frequency divider?",
    options: ["SR flip-flop", "D flip-flop", "JK flip-flop", "T flip-flop"],
    correctOptionIndex: 3,
    explanation: "T flip-flop with T=1 toggles on each clock pulse, effectively dividing the input frequency by 2.",
    subject: "Digital Electronics",
    chapter: "Flip Flops",
    authorId: "lecturer-001"
  },

  // Digital Electronics - Counters (10 questions)
  {
    questionText: "A counter is a sequential circuit that:",
    options: ["Counts pulses", "Stores data", "Performs arithmetic", "All of the above"],
    correctOptionIndex: 0,
    explanation: "A counter is primarily a sequential circuit designed to count the number of input pulses.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "A 4-bit binary counter can count up to:",
    options: ["15", "16", "31", "32"],
    correctOptionIndex: 0,
    explanation: "A 4-bit counter can represent 2^4 = 16 states (0 to 15).",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "In an asynchronous counter:",
    options: ["All flip-flops are clocked simultaneously", "Flip-flops are clocked in sequence", "No clock is used", "External clock controls all stages"],
    correctOptionIndex: 1,
    explanation: "In asynchronous (ripple) counters, each flip-flop is clocked by the output of the previous stage.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "The main disadvantage of ripple counters is:",
    options: ["High power consumption", "Complex design", "Propagation delay accumulation", "Limited counting range"],
    correctOptionIndex: 2,
    explanation: "Ripple counters suffer from cumulative propagation delays, making them slower for high-frequency applications.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "A synchronous counter:",
    options: ["Uses a common clock for all flip-flops", "Has no propagation delay issues", "Is faster than asynchronous counters", "All of the above"],
    correctOptionIndex: 3,
    explanation: "Synchronous counters use a common clock, eliminate cumulative delays, and are faster than asynchronous counters.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "A decade counter counts from:",
    options: ["0 to 9", "1 to 10", "0 to 15", "1 to 16"],
    correctOptionIndex: 0,
    explanation: "A decade counter counts in decimal from 0 to 9 (10 states total).",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "The modulus of a counter refers to:",
    options: ["Maximum count value", "Number of flip-flops", "Number of counting states", "Clock frequency"],
    correctOptionIndex: 2,
    explanation: "Modulus is the number of different counting states in the counter's sequence.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "To design a MOD-6 counter, you need:",
    options: ["2 flip-flops", "3 flip-flops", "4 flip-flops", "6 flip-flops"],
    correctOptionIndex: 1,
    explanation: "For MOD-6 counter, you need at least 3 flip-flops since 2^2 = 4 < 6 < 8 = 2^3.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "An up-down counter can:",
    options: ["Only count up", "Only count down", "Count in both directions", "Count in binary only"],
    correctOptionIndex: 2,
    explanation: "An up-down counter can count in both ascending and descending order based on a control input.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },
  {
    questionText: "Ring counters are used for:",
    options: ["High-speed counting", "Sequence generation", "Frequency division", "Data storage"],
    correctOptionIndex: 1,
    explanation: "Ring counters are primarily used for generating timing sequences and control signals.",
    subject: "Digital Electronics",
    chapter: "Counters",
    authorId: "lecturer-001"
  },

  // Analog Electronics - Op-Amps (10 questions)
  {
    questionText: "What is the input impedance of an ideal op-amp?",
    options: ["Zero", "Very low", "Medium", "Infinite"],
    correctOptionIndex: 3,
    explanation: "An ideal op-amp has infinite input impedance, meaning no current flows into the input terminals.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "In an inverting amplifier using an op-amp, if Rf = 10kΩ and Rin = 1kΩ, what is the voltage gain?",
    options: ["-10", "+10", "-1", "+1"],
    correctOptionIndex: 0,
    explanation: "For an inverting amplifier, the voltage gain is -Rf/Rin = -10kΩ/1kΩ = -10. The negative sign indicates phase inversion.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "The output impedance of an ideal op-amp is:",
    options: ["Infinite", "Very high", "Medium", "Zero"],
    correctOptionIndex: 3,
    explanation: "An ideal op-amp has zero output impedance, allowing it to drive any load without voltage drop.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "Virtual short concept in op-amps means:",
    options: ["Inputs are physically shorted", "Input voltage difference is zero", "Output is shorted", "Power supply is shorted"],
    correctOptionIndex: 1,
    explanation: "Virtual short means that in negative feedback, the voltage difference between the two inputs is virtually zero.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "A non-inverting amplifier has a voltage gain of:",
    options: ["1 + Rf/Rin", "-Rf/Rin", "Rf/Rin", "1 - Rf/Rin"],
    correctOptionIndex: 0,
    explanation: "Non-inverting amplifier gain is (1 + Rf/Rin), which is always positive and greater than 1.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "The CMRR (Common Mode Rejection Ratio) of an op-amp should be:",
    options: ["As low as possible", "Equal to 1", "As high as possible", "Equal to zero"],
    correctOptionIndex: 2,
    explanation: "High CMRR means the op-amp can effectively reject common-mode signals while amplifying differential signals.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "A voltage follower (buffer) has a voltage gain of:",
    options: ["0", "1", "-1", "Infinite"],
    correctOptionIndex: 1,
    explanation: "A voltage follower has unity gain (1) and provides high input impedance and low output impedance.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "The slew rate of an op-amp is measured in:",
    options: ["V/s", "V/ms", "V/μs", "V/ns"],
    correctOptionIndex: 2,
    explanation: "Slew rate is typically measured in V/μs and represents the maximum rate of change of output voltage.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "Offset voltage in op-amps causes:",
    options: ["Gain error", "Phase shift", "Output voltage when inputs are zero", "Frequency response change"],
    correctOptionIndex: 2,
    explanation: "Input offset voltage causes a DC output voltage even when both inputs are grounded (zero).",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },
  {
    questionText: "Which op-amp configuration has the highest input impedance?",
    options: ["Inverting amplifier", "Non-inverting amplifier", "Voltage follower", "Differential amplifier"],
    correctOptionIndex: 1,
    explanation: "Non-inverting amplifier has the highest input impedance as the input is directly connected to the high-impedance op-amp input.",
    subject: "Analog Electronics",
    chapter: "Op-Amps",
    authorId: "lecturer-001"
  },

  // Analog Electronics - Oscillators (10 questions)
  {
    questionText: "An oscillator is a circuit that:",
    options: ["Amplifies signals", "Generates periodic signals", "Filters signals", "Rectifies signals"],
    correctOptionIndex: 1,
    explanation: "An oscillator generates periodic waveforms without requiring an external input signal.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "The Barkhausen criterion for oscillation states that:",
    options: ["Loop gain = 1 and phase shift = 0°", "Loop gain > 1 and phase shift = 180°", "Loop gain = 1 and phase shift = 180°", "Loop gain < 1 and phase shift = 0°"],
    correctOptionIndex: 0,
    explanation: "For sustained oscillation, the loop gain must be 1 and total phase shift around the loop must be 0° (or 360°).",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "A Wien bridge oscillator generates:",
    options: ["Square waves", "Triangular waves", "Sine waves", "Sawtooth waves"],
    correctOptionIndex: 2,
    explanation: "Wien bridge oscillator is commonly used to generate low-distortion sine waves.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "The frequency of oscillation in an RC oscillator depends on:",
    options: ["Only R values", "Only C values", "Both R and C values", "Supply voltage"],
    correctOptionIndex: 2,
    explanation: "RC oscillator frequency is determined by the RC time constant, hence depends on both R and C values.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "Crystal oscillators are preferred for:",
    options: ["High power applications", "High frequency stability", "Low cost applications", "Variable frequency generation"],
    correctOptionIndex: 1,
    explanation: "Crystal oscillators provide excellent frequency stability and accuracy, making them ideal for precision timing applications.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "In a Colpitts oscillator, the feedback network consists of:",
    options: ["Two inductors", "Two capacitors", "Two resistors", "One inductor and one capacitor"],
    correctOptionIndex: 1,
    explanation: "Colpitts oscillator uses a capacitive voltage divider (two capacitors) in the feedback network.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "The phase shift oscillator uses:",
    options: ["RC networks", "LC networks", "Crystal", "Transformer coupling"],
    correctOptionIndex: 0,
    explanation: "Phase shift oscillator uses RC networks to provide the required 180° phase shift for oscillation.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "Relaxation oscillators generate:",
    options: ["Pure sine waves", "Non-sinusoidal waves", "Only square waves", "Only triangular waves"],
    correctOptionIndex: 1,
    explanation: "Relaxation oscillators generate non-sinusoidal waveforms like square, triangular, or sawtooth waves.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "The 555 timer in astable mode acts as:",
    options: ["Amplifier", "Oscillator", "Filter", "Rectifier"],
    correctOptionIndex: 1,
    explanation: "555 timer in astable mode generates continuous square wave output, functioning as an oscillator.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },
  {
    questionText: "Hartley oscillator differs from Colpitts oscillator in:",
    options: ["Frequency range", "Feedback network", "Power consumption", "Output waveform"],
    correctOptionIndex: 1,
    explanation: "Hartley oscillator uses inductive voltage divider (tapped inductor) while Colpitts uses capacitive voltage divider.",
    subject: "Analog Electronics",
    chapter: "Oscillators",
    authorId: "lecturer-001"
  },

  // Analog Electronics - Filters (10 questions)
  {
    questionText: "A low-pass filter allows:",
    options: ["High frequencies to pass", "Low frequencies to pass", "All frequencies to pass", "No frequencies to pass"],
    correctOptionIndex: 1,
    explanation: "A low-pass filter allows frequencies below the cutoff frequency to pass while attenuating higher frequencies.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "The cutoff frequency of a filter is defined as the frequency where gain is:",
    options: ["-3dB from maximum", "-6dB from maximum", "-10dB from maximum", "-20dB from maximum"],
    correctOptionIndex: 0,
    explanation: "Cutoff frequency is where the gain drops to -3dB (or 70.7%) of the maximum gain.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "A band-pass filter:",
    options: ["Passes all frequencies", "Blocks all frequencies", "Passes a specific range of frequencies", "Passes only DC"],
    correctOptionIndex: 2,
    explanation: "A band-pass filter allows only a specific range of frequencies (between two cutoff frequencies) to pass.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "The roll-off rate of a first-order filter is:",
    options: ["6dB/octave", "12dB/octave", "18dB/octave", "20dB/octave"],
    correctOptionIndex: 0,
    explanation: "A first-order filter has a roll-off rate of 6dB per octave (or 20dB per decade).",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "Active filters use:",
    options: ["Only passive components", "Only active components", "Both active and passive components", "Only digital components"],
    correctOptionIndex: 2,
    explanation: "Active filters use both active components (like op-amps) and passive components (resistors, capacitors).",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "The main advantage of active filters over passive filters is:",
    options: ["Lower cost", "No power supply needed", "Gain and isolation", "Higher power handling"],
    correctOptionIndex: 2,
    explanation: "Active filters can provide gain and good isolation between input and output, unlike passive filters.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "A notch filter is used to:",
    options: ["Pass all frequencies", "Block a specific frequency", "Amplify signals", "Generate signals"],
    correctOptionIndex: 1,
    explanation: "A notch (band-stop) filter blocks a specific frequency or narrow band of frequencies.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "Butterworth filters are characterized by:",
    options: ["Ripples in passband", "Flat response in passband", "Sharp cutoff", "High Q factor"],
    correctOptionIndex: 1,
    explanation: "Butterworth filters have a maximally flat response in the passband with no ripples.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "The Q factor of a filter indicates:",
    options: ["Quality of components", "Selectivity of the filter", "Power consumption", "Gain of the filter"],
    correctOptionIndex: 1,
    explanation: "Q factor indicates the selectivity or sharpness of the filter's frequency response.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },
  {
    questionText: "Chebyshev filters have:",
    options: ["Flat passband response", "Ripples in passband", "Linear phase response", "Infinite attenuation"],
    correctOptionIndex: 1,
    explanation: "Chebyshev filters have ripples in the passband but provide sharper cutoff than Butterworth filters.",
    subject: "Analog Electronics",
    chapter: "Filters",
    authorId: "lecturer-001"
  },

  // Analog Electronics - Power Amplifiers (10 questions)
  {
    questionText: "The main purpose of a power amplifier is to:",
    options: ["Increase voltage", "Increase current", "Increase power", "Increase frequency"],
    correctOptionIndex: 2,
    explanation: "Power amplifiers are designed to increase the power level of the input signal to drive loads like speakers.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Class A power amplifiers have:",
    options: ["High efficiency", "Low distortion", "High power output", "Low heat dissipation"],
    correctOptionIndex: 1,
    explanation: "Class A amplifiers have low distortion but poor efficiency (maximum 25% for single-ended, 50% for push-pull).",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The maximum theoretical efficiency of a Class B amplifier is:",
    options: ["25%", "50%", "78.5%", "100%"],
    correctOptionIndex: 2,
    explanation: "Class B amplifiers have a maximum theoretical efficiency of π/4 ≈ 78.5%.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Crossover distortion occurs in:",
    options: ["Class A amplifiers", "Class B amplifiers", "Class C amplifiers", "Class D amplifiers"],
    correctOptionIndex: 1,
    explanation: "Crossover distortion occurs in Class B amplifiers when the signal crosses zero, causing a dead zone.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Class AB amplifiers are designed to:",
    options: ["Maximize efficiency", "Minimize crossover distortion", "Maximize power output", "Minimize cost"],
    correctOptionIndex: 1,
    explanation: "Class AB amplifiers use slight forward bias to eliminate crossover distortion while maintaining reasonable efficiency.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Heat sinks are used in power amplifiers to:",
    options: ["Increase gain", "Reduce noise", "Dissipate heat", "Improve frequency response"],
    correctOptionIndex: 2,
    explanation: "Heat sinks dissipate the heat generated by power transistors to prevent thermal damage.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The conduction angle in Class C amplifiers is:",
    options: ["360°", "180°", "Less than 180°", "More than 360°"],
    correctOptionIndex: 2,
    explanation: "Class C amplifiers have a conduction angle less than 180°, typically around 120°.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Complementary symmetry amplifiers use:",
    options: ["Only NPN transistors", "Only PNP transistors", "Both NPN and PNP transistors", "Only FETs"],
    correctOptionIndex: 2,
    explanation: "Complementary symmetry amplifiers use matched pairs of NPN and PNP transistors for push-pull operation.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "The load line of a power amplifier should:",
    options: ["Be horizontal", "Be vertical", "Pass through the Q-point", "Be circular"],
    correctOptionIndex: 2,
    explanation: "The AC load line must pass through the Q-point to ensure proper operation and maximum power transfer.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  },
  {
    questionText: "Thermal runaway in power amplifiers is caused by:",
    options: ["Low temperature", "High voltage", "Positive temperature coefficient of current", "Low current"],
    correctOptionIndex: 2,
    explanation: "Thermal runaway occurs when increasing temperature causes more current flow, generating more heat in a positive feedback loop.",
    subject: "Analog Electronics",
    chapter: "Power Amplifiers",
    authorId: "lecturer-001"
  }
];

// Instructions for setting up Firebase with sample data
export const setupInstructions = `
COMPREHENSIVE SAMPLE DATA FOR QUIZITI (120 QUESTIONS)

This sample data includes ALL chapters with exactly 10 questions each:

📚 BASIC ELECTRONICS (40 questions):
- Semiconductors (10 questions) ✅
- Diodes (10 questions) ✅
- Transistors (10 questions) ✅
- Amplifiers (10 questions) ✅

💻 DIGITAL ELECTRONICS (40 questions):
- Logic Gates (10 questions) ✅
- Boolean Algebra (10 questions) ✅
- Flip Flops (10 questions) ✅
- Counters (10 questions) ✅

🔧 ANALOG ELECTRONICS (40 questions):
- Op-Amps (10 questions) ✅
- Oscillators (10 questions) ✅
- Filters (10 questions) ✅
- Power Amplifiers (10 questions) ✅

Database Structure: Subject → Chapter (NO TOPICS)
- Clean, consistent data structure
- Production-ready sample questions
- Complete coverage of all UI chapters

To populate your Firebase database:
1. Import this file in your setup script
2. Use Firebase SDK to add the data
3. Set up proper security rules
4. Test with sample credentials

Sample login credentials:
- Lecturer: lecturer@quiziti.com / password123
- Student 1: student1@quiziti.com / password123
- Student 2: student2@quiziti.com / password123

✅ EVERY CHAPTER NOW HAS EXACTLY 10 QUESTIONS!
- No more "insufficient questions" errors
- Perfect match with UI chapter selection
- Professional quality questions with explanations
`;

// Clean sample data without topic fields - Subject → Chapter structure only
export default {
  sampleUsers,
  sampleQuestions,
  setupInstructions
};