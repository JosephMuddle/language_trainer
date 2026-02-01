// Generative Grammar System for Language Production Trainer
// Uses slot-based templates with extensive vocabulary to generate millions of unique sentences

// ============================================================================
// VOCABULARY POOLS
// ============================================================================

const vocab = {
    // People
    names: ["Maria", "John", "Sofia", "Michael", "Emma", "Carlos", "Anna", "James", "Lisa", "David",
            "Elena", "Thomas", "Sarah", "Daniel", "Laura", "Robert", "Julia", "William", "Clara", "Peter",
            "Isabella", "Alexander", "Victoria", "Benjamin", "Olivia", "Sebastian", "Charlotte", "Lucas"],

    professions: ["teacher", "doctor", "engineer", "artist", "chef", "lawyer", "nurse", "architect",
                  "musician", "writer", "scientist", "photographer", "designer", "accountant", "pilot",
                  "mechanic", "farmer", "journalist", "therapist", "professor", "dentist", "veterinarian"],

    relations: ["mother", "father", "sister", "brother", "friend", "colleague", "neighbor", "boss",
                "grandmother", "grandfather", "aunt", "uncle", "cousin", "partner", "roommate"],

    // Places
    countries: ["Spain", "France", "Germany", "Italy", "Japan", "Brazil", "Mexico", "Canada",
                "Australia", "England", "Portugal", "Argentina", "China", "India", "Sweden",
                "Greece", "Turkey", "Egypt", "Morocco", "Thailand", "Vietnam", "Peru", "Chile"],

    cities: ["Paris", "London", "Tokyo", "New York", "Berlin", "Rome", "Madrid", "Sydney",
             "Toronto", "Amsterdam", "Barcelona", "Vienna", "Prague", "Dublin", "Lisbon",
             "Seoul", "Bangkok", "Mumbai", "Cairo", "Athens", "Venice", "Florence", "Munich"],

    places: ["park", "beach", "museum", "restaurant", "library", "hospital", "airport", "station",
             "supermarket", "mall", "gym", "cinema", "theater", "hotel", "office", "school",
             "university", "church", "market", "pharmacy", "bank", "post office", "café", "bakery"],

    rooms: ["kitchen", "bedroom", "bathroom", "living room", "garden", "balcony", "garage", "basement",
            "attic", "dining room", "office", "hallway", "terrace", "patio"],

    // Objects
    objects: ["book", "phone", "computer", "bag", "key", "wallet", "umbrella", "glasses", "watch",
              "camera", "laptop", "tablet", "newspaper", "magazine", "letter", "package", "suitcase",
              "bicycle", "guitar", "piano", "painting", "photograph", "plant", "lamp", "chair"],

    foods: ["pizza", "pasta", "sushi", "salad", "soup", "bread", "rice", "chicken", "fish", "beef",
            "vegetables", "fruit", "cheese", "eggs", "sandwich", "cake", "ice cream", "chocolate",
            "coffee", "tea", "juice", "wine", "beer", "water", "milk"],

    clothing: ["shirt", "dress", "jacket", "coat", "shoes", "hat", "scarf", "gloves", "jeans",
               "sweater", "suit", "tie", "skirt", "boots", "sneakers", "socks", "belt"],

    animals: ["dog", "cat", "bird", "horse", "fish", "rabbit", "elephant", "lion", "tiger", "bear",
              "monkey", "dolphin", "whale", "snake", "turtle", "owl", "eagle", "wolf", "deer", "fox"],

    // Descriptors
    adjPositive: ["beautiful", "wonderful", "excellent", "amazing", "fantastic", "great", "lovely",
                  "delicious", "comfortable", "interesting", "exciting", "impressive", "perfect"],

    adjNegative: ["terrible", "awful", "horrible", "boring", "disappointing", "uncomfortable",
                  "annoying", "frustrating", "exhausting", "confusing", "difficult", "expensive"],

    adjNeutral: ["big", "small", "old", "new", "long", "short", "tall", "young", "quiet", "loud",
                 "fast", "slow", "hot", "cold", "warm", "cool", "dark", "bright", "heavy", "light"],

    colors: ["red", "blue", "green", "yellow", "black", "white", "brown", "orange", "purple", "pink",
             "gray", "gold", "silver", "beige", "navy", "turquoise"],

    emotions: ["happy", "sad", "angry", "excited", "nervous", "tired", "bored", "surprised",
               "confused", "worried", "relaxed", "stressed", "grateful", "proud", "embarrassed"],

    // Time expressions
    timeToday: ["today", "this morning", "this afternoon", "this evening", "tonight", "right now"],
    timePast: ["yesterday", "last week", "last month", "last year", "two days ago", "a week ago",
               "last night", "last summer", "in 2020", "when I was young", "a long time ago"],
    timeFuture: ["tomorrow", "next week", "next month", "next year", "in two days", "soon",
                 "next summer", "in the future", "later today", "this weekend"],

    frequency: ["always", "usually", "often", "sometimes", "rarely", "never", "every day",
                "once a week", "twice a month", "from time to time", "occasionally"],

    duration: ["for five minutes", "for an hour", "for two days", "for a week", "for three months",
               "for years", "since morning", "since last year", "since 2015", "all day", "all night"],

    // Actions (base forms)
    verbsBasic: ["eat", "drink", "sleep", "walk", "run", "read", "write", "speak", "listen", "watch",
                 "cook", "clean", "work", "study", "play", "dance", "sing", "swim", "drive", "fly"],

    verbsComplex: ["understand", "remember", "forget", "believe", "think", "know", "feel", "want",
                   "need", "hope", "expect", "prefer", "decide", "plan", "prepare", "organize",
                   "explain", "describe", "discuss", "consider", "suggest", "recommend"],

    verbsMovement: ["go", "come", "arrive", "leave", "return", "travel", "visit", "move", "enter",
                    "exit", "climb", "fall", "jump", "sit", "stand", "lie down", "turn"],

    verbsCommunication: ["say", "tell", "ask", "answer", "explain", "describe", "mention", "suggest",
                         "promise", "agree", "disagree", "complain", "apologize", "thank", "invite"],

    // Connectors and transitions
    connectorsCause: ["because", "since", "as", "due to the fact that"],
    connectorsContrast: ["but", "however", "although", "even though", "despite", "nevertheless"],
    connectorsAddition: ["and", "also", "moreover", "furthermore", "in addition", "besides"],
    connectorsResult: ["so", "therefore", "as a result", "consequently", "thus"],

    // Opinion phrases
    opinionIntro: ["I think", "I believe", "In my opinion", "It seems to me", "I feel that",
                   "From my point of view", "As far as I know", "I'm convinced that"],

    // Numbers
    smallNumbers: ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
    largeNumbers: ["twenty", "thirty", "fifty", "hundred", "thousand"],
    ordinals: ["first", "second", "third", "fourth", "fifth", "last", "next", "previous"],

    // Topics for abstract discussions (higher levels)
    abstractTopics: ["education", "technology", "environment", "health", "economy", "politics",
                     "culture", "society", "science", "art", "music", "literature", "history",
                     "philosophy", "psychology", "communication", "globalization", "innovation"],

    abstractConcepts: ["freedom", "equality", "justice", "progress", "success", "happiness",
                       "creativity", "responsibility", "opportunity", "challenge", "change",
                       "tradition", "identity", "diversity", "sustainability", "efficiency"]
};

// ============================================================================
// GRAMMAR CATEGORIES - Used for Spaced Repetition
// ============================================================================

const grammarCategories = {
    // A1 Categories
    "present-simple-be": { name: "Present Simple (to be)", level: "A1", description: "I am, you are, he/she is" },
    "present-simple-have": { name: "Present Simple (to have)", level: "A1", description: "I have, she has" },
    "present-simple": { name: "Present Simple", level: "A1", description: "Regular verbs in present tense" },
    "basic-questions": { name: "Basic Questions", level: "A1", description: "Where, what, do you...?" },
    "greetings": { name: "Greetings & Basics", level: "A1", description: "Hello, thank you, please" },
    "numbers": { name: "Numbers & Counting", level: "A1", description: "Cardinal numbers" },

    // A2 Categories
    "past-simple": { name: "Past Simple", level: "A2", description: "Regular and irregular past tense" },
    "future-going-to": { name: "Future (going to)", level: "A2", description: "Plans and intentions" },
    "present-continuous": { name: "Present Continuous", level: "A2", description: "Actions happening now" },
    "comparatives": { name: "Comparatives", level: "A2", description: "More than, bigger than" },
    "modals-basic": { name: "Modal Verbs (basic)", level: "A2", description: "Can, must, should, have to" },
    "frequency-adverbs": { name: "Frequency Adverbs", level: "A2", description: "Always, usually, sometimes" },
    "connectors-basic": { name: "Basic Connectors", level: "A2", description: "And, but, because, so" },

    // B1 Categories
    "present-perfect": { name: "Present Perfect", level: "B1", description: "Have done, has been" },
    "past-continuous": { name: "Past Continuous", level: "B1", description: "Was doing, were playing" },
    "first-conditional": { name: "First Conditional", level: "B1", description: "If + present, will + verb" },
    "opinions": { name: "Expressing Opinions", level: "B1", description: "I think, I believe, in my opinion" },
    "reported-speech-basic": { name: "Reported Speech (basic)", level: "B1", description: "She said that..." },
    "purpose-reason": { name: "Purpose & Reason", level: "B1", description: "To + verb, for + noun" },
    "passive-basic": { name: "Passive Voice (basic)", level: "B1", description: "Was made, is spoken" },
    "relative-clauses-basic": { name: "Relative Clauses (basic)", level: "B1", description: "Who, which, where, when" },

    // B2 Categories
    "second-conditional": { name: "Second Conditional", level: "B2", description: "If + past, would + verb" },
    "third-conditional": { name: "Third Conditional", level: "B2", description: "If + past perfect, would have" },
    "past-perfect": { name: "Past Perfect", level: "B2", description: "Had done, had been" },
    "wishes": { name: "Wishes & Regrets", level: "B2", description: "I wish, if only, I'd rather" },
    "modals-perfect": { name: "Modal Perfects", level: "B2", description: "Should have, must have, might have" },
    "relative-clauses-advanced": { name: "Relative Clauses (advanced)", level: "B2", description: "Whose, in which, the reason why" },
    "passive-advanced": { name: "Passive Voice (advanced)", level: "B2", description: "Is believed to, is being done" },
    "abstract-concepts": { name: "Abstract Discussion", level: "B2", description: "Discussing abstract ideas" },

    // C1 Categories
    "mixed-conditionals": { name: "Mixed Conditionals", level: "C1", description: "Combining conditional types" },
    "inversion": { name: "Inversion", level: "C1", description: "Never have I, not only did" },
    "cleft-sentences": { name: "Cleft Sentences", level: "C1", description: "What I need is, It was X that" },
    "nuanced-expressions": { name: "Nuanced Expressions", level: "C1", description: "Subtle meanings and hedging" },
    "hedging-politeness": { name: "Hedging & Politeness", level: "C1", description: "I was wondering, would you mind" },
    "idioms": { name: "Idiomatic Expressions", level: "C1", description: "Common idioms and phrases" },
    "complex-reasoning": { name: "Complex Reasoning", level: "C1", description: "Given that, in light of" },

    // C2 Categories
    "literary-formal": { name: "Literary & Formal", level: "C2", description: "High register expressions" },
    "rare-structures": { name: "Rare Structures", level: "C2", description: "Uncommon grammatical forms" },
    "philosophical": { name: "Philosophical Language", level: "C2", description: "Abstract philosophical discussion" },
    "complex-syntax": { name: "Complex Syntax", level: "C2", description: "Sophisticated sentence structures" },
    "argumentation": { name: "Sophisticated Argumentation", level: "C2", description: "Academic argument structures" },
    "literary-references": { name: "Literary References", level: "C2", description: "Allusions and metaphors" },

    // Conversational Categories (all levels)
    "greetings-responses": { name: "Greeting Responses", level: "A1", description: "Responding to greetings" },
    "basic-questions-responses": { name: "Basic Question Responses", level: "A1", description: "Answering simple questions" },
    "polite-expressions": { name: "Polite Expressions", level: "A1", description: "Please, thank you, sorry" },
    "yes-no-responses": { name: "Yes/No Responses", level: "A2", description: "Answering yes/no questions" },
    "preference-responses": { name: "Expressing Preferences", level: "A2", description: "Likes, dislikes, preferences" },
    "invitation-responses": { name: "Invitation Responses", level: "A2", description: "Accepting/declining invitations" },
    "opinion-responses": { name: "Opinion Responses", level: "B1", description: "Agreeing, disagreeing, elaborating" },
    "suggestion-responses": { name: "Suggestion Responses", level: "B1", description: "Responding to suggestions" },
    "clarification-responses": { name: "Asking for Clarification", level: "B1", description: "When you don't understand" },
    "emotion-responses": { name: "Emotional Responses", level: "B1", description: "Responding to news/emotions" },
    "negotiation-responses": { name: "Negotiation", level: "B2", description: "Compromising, counter-proposing" },
    "persuasion-responses": { name: "Persuasion", level: "B2", description: "Convincing others" },
    "diplomatic-responses": { name: "Diplomatic Responses", level: "C1", description: "Tactful, nuanced responses" }
};

// ============================================================================
// GRAMMAR TEMPLATES BY LEVEL (with grammar categories)
// ============================================================================

const grammarTemplates = {
    A1: [
        // Simple present with BE
        { pattern: "I am {emotion}.", slots: { emotion: "emotions" }, grammar: ["present-simple-be"] },
        { pattern: "{name} is a {profession}.", slots: { name: "names", profession: "professions" }, grammar: ["present-simple-be"] },
        { pattern: "The {object} is {color}.", slots: { object: "objects", color: "colors" }, grammar: ["present-simple-be"] },
        { pattern: "We are in the {place}.", slots: { place: "places" }, grammar: ["present-simple-be"] },
        { pattern: "It is {adjNeutral} today.", slots: { adjNeutral: "adjNeutral" }, grammar: ["present-simple-be"] },
        { pattern: "My {relation} is from {country}.", slots: { relation: "relations", country: "countries" }, grammar: ["present-simple-be"] },
        { pattern: "The {animal} is {adjNeutral}.", slots: { animal: "animals", adjNeutral: "adjNeutral" }, grammar: ["present-simple-be"] },

        // Simple present with HAVE
        { pattern: "I have a {color} {object}.", slots: { color: "colors", object: "objects" }, grammar: ["present-simple-have"] },
        { pattern: "{name} has a {animal}.", slots: { name: "names", animal: "animals" }, grammar: ["present-simple-have"] },
        { pattern: "We have {smallNumber} {object}s.", slots: { smallNumber: "smallNumbers", object: "objects" }, grammar: ["present-simple-have", "numbers"] },
        { pattern: "Do you have a {object}?", slots: { object: "objects" }, grammar: ["present-simple-have", "basic-questions"] },

        // Simple present - other verbs
        { pattern: "I like {food}.", slots: { food: "foods" }, grammar: ["present-simple"] },
        { pattern: "{name} speaks English.", slots: { name: "names" }, grammar: ["present-simple"] },
        { pattern: "I want {food}.", slots: { food: "foods" }, grammar: ["present-simple"] },
        { pattern: "She reads {object}s.", slots: { object: "objects" }, grammar: ["present-simple"] },
        { pattern: "We live in {city}.", slots: { city: "cities" }, grammar: ["present-simple"] },
        { pattern: "They work in an {place}.", slots: { place: "places" }, grammar: ["present-simple"] },
        { pattern: "I need a {object}.", slots: { object: "objects" }, grammar: ["present-simple"] },
        { pattern: "He plays with the {animal}.", slots: { animal: "animals" }, grammar: ["present-simple"] },

        // Basic questions
        { pattern: "Where is the {place}?", slots: { place: "places" }, grammar: ["basic-questions", "present-simple-be"] },
        { pattern: "What is your {object}?", slots: { object: "objects" }, grammar: ["basic-questions", "present-simple-be"] },
        { pattern: "Do you like {food}?", slots: { food: "foods" }, grammar: ["basic-questions", "present-simple"] },
        { pattern: "Is this your {object}?", slots: { object: "objects" }, grammar: ["basic-questions", "present-simple-be"] },
        { pattern: "Where do you live?", slots: {}, grammar: ["basic-questions", "present-simple"] },
        { pattern: "What time is it?", slots: {}, grammar: ["basic-questions"] },
        { pattern: "How are you?", slots: {}, grammar: ["basic-questions", "greetings"] },

        // Greetings and basics
        { pattern: "Hello, my name is {name}.", slots: { name: "names" }, grammar: ["greetings", "present-simple-be"] },
        { pattern: "Nice to meet you.", slots: {}, grammar: ["greetings"] },
        { pattern: "Good morning.", slots: {}, grammar: ["greetings"] },
        { pattern: "Thank you very much.", slots: {}, grammar: ["greetings"] },
        { pattern: "Please help me.", slots: {}, grammar: ["greetings"] },
        { pattern: "I don't understand.", slots: {}, grammar: ["greetings", "present-simple"] },
        { pattern: "Excuse me, where is the {place}?", slots: { place: "places" }, grammar: ["greetings", "basic-questions"] },

        // Numbers and counting
        { pattern: "I am {smallNumber} years old.", slots: { smallNumber: "smallNumbers" }, grammar: ["numbers", "present-simple-be"] },
        { pattern: "There are {smallNumber} {animal}s.", slots: { smallNumber: "smallNumbers", animal: "animals" }, grammar: ["numbers", "present-simple-be"] },
        { pattern: "I have {smallNumber} {object}s.", slots: { smallNumber: "smallNumbers", object: "objects" }, grammar: ["numbers", "present-simple-have"] }
    ],

    A2: [
        // Past tense
        { pattern: "I went to the {place} {timePast}.", slots: { place: "places", timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "{name} visited {city} {timePast}.", slots: { name: "names", city: "cities", timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "We watched a movie {timePast}.", slots: { timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "I ate {food} for dinner {timePast}.", slots: { food: "foods", timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "She bought a {color} {clothing} {timePast}.", slots: { color: "colors", clothing: "clothing", timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "They arrived at the {place} {timePast}.", slots: { place: "places", timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "I didn't see {name} {timePast}.", slots: { name: "names", timePast: "timePast" }, grammar: ["past-simple"] },
        { pattern: "Did you eat {food}?", slots: { food: "foods" }, grammar: ["past-simple", "basic-questions"] },
        { pattern: "The {animal} ran away {timePast}.", slots: { animal: "animals", timePast: "timePast" }, grammar: ["past-simple"] },

        // Going to future
        { pattern: "I am going to visit {city} {timeFuture}.", slots: { city: "cities", timeFuture: "timeFuture" }, grammar: ["future-going-to"] },
        { pattern: "{name} is going to become a {profession}.", slots: { name: "names", profession: "professions" }, grammar: ["future-going-to"] },
        { pattern: "We are going to buy a {object} {timeFuture}.", slots: { object: "objects", timeFuture: "timeFuture" }, grammar: ["future-going-to"] },
        { pattern: "Are you going to travel to {country} {timeFuture}?", slots: { country: "countries", timeFuture: "timeFuture" }, grammar: ["future-going-to", "basic-questions"] },
        { pattern: "They are going to move to {city}.", slots: { city: "cities" }, grammar: ["future-going-to"] },

        // Present continuous
        { pattern: "I am reading a {object} right now.", slots: { object: "objects" }, grammar: ["present-continuous"] },
        { pattern: "{name} is cooking {food}.", slots: { name: "names", food: "foods" }, grammar: ["present-continuous"] },
        { pattern: "They are playing in the {place}.", slots: { place: "places" }, grammar: ["present-continuous"] },
        { pattern: "What are you doing?", slots: {}, grammar: ["present-continuous", "basic-questions"] },
        { pattern: "She is wearing a {color} {clothing}.", slots: { color: "colors", clothing: "clothing" }, grammar: ["present-continuous"] },
        { pattern: "It is raining outside.", slots: {}, grammar: ["present-continuous"] },
        { pattern: "The {animal} is sleeping.", slots: { animal: "animals" }, grammar: ["present-continuous"] },

        // Comparatives
        { pattern: "This {object} is more {adjPositive} than that one.", slots: { object: "objects", adjPositive: "adjPositive" }, grammar: ["comparatives"] },
        { pattern: "{city} is bigger than {city2}.", slots: { city: "cities", city2: "cities" }, grammar: ["comparatives"] },
        { pattern: "The {food} is more {adjPositive} than the {food2}.", slots: { food: "foods", adjPositive: "adjPositive", food2: "foods" }, grammar: ["comparatives"] },
        { pattern: "Today is {adjNeutral}er than yesterday.", slots: { adjNeutral: "adjNeutral" }, grammar: ["comparatives"] },

        // Modal verbs
        { pattern: "I can speak {smallNumber} languages.", slots: { smallNumber: "smallNumbers" }, grammar: ["modals-basic", "numbers"] },
        { pattern: "{name} can't come to the {place}.", slots: { name: "names", place: "places" }, grammar: ["modals-basic"] },
        { pattern: "You must finish your {object}.", slots: { object: "objects" }, grammar: ["modals-basic"] },
        { pattern: "We should visit the {place}.", slots: { place: "places" }, grammar: ["modals-basic"] },
        { pattern: "Can you help me with the {object}?", slots: { object: "objects" }, grammar: ["modals-basic", "basic-questions"] },
        { pattern: "I have to work {timeFuture}.", slots: { timeFuture: "timeFuture" }, grammar: ["modals-basic"] },

        // Frequency adverbs
        { pattern: "I {frequency} eat {food} for breakfast.", slots: { frequency: "frequency", food: "foods" }, grammar: ["frequency-adverbs", "present-simple"] },
        { pattern: "{name} {frequency} goes to the {place}.", slots: { name: "names", frequency: "frequency", place: "places" }, grammar: ["frequency-adverbs", "present-simple"] },
        { pattern: "We {frequency} watch movies on weekends.", slots: { frequency: "frequency" }, grammar: ["frequency-adverbs", "present-simple"] },
        { pattern: "They {frequency} travel to {country}.", slots: { frequency: "frequency", country: "countries" }, grammar: ["frequency-adverbs", "present-simple"] },

        // Connectors
        { pattern: "I like {food} but I prefer {food2}.", slots: { food: "foods", food2: "foods" }, grammar: ["connectors-basic", "present-simple"] },
        { pattern: "{name} is {adjPositive} and {adjPositive2}.", slots: { name: "names", adjPositive: "adjPositive", adjPositive2: "adjPositive" }, grammar: ["connectors-basic", "present-simple-be"] },
        { pattern: "I stayed home because it was {adjNegative}.", slots: { adjNegative: "adjNegative" }, grammar: ["connectors-basic", "past-simple"] },
        { pattern: "I want to go to the {place}, but I can't.", slots: { place: "places" }, grammar: ["connectors-basic", "modals-basic"] }
    ],

    B1: [
        // Present perfect
        { pattern: "I have lived in {city} {duration}.", slots: { city: "cities", duration: "duration" }, grammar: ["present-perfect"] },
        { pattern: "{name} has never been to {country}.", slots: { name: "names", country: "countries" }, grammar: ["present-perfect"] },
        { pattern: "We have already finished the {object}.", slots: { object: "objects" }, grammar: ["present-perfect"] },
        { pattern: "Have you ever tried {food}?", slots: { food: "foods" }, grammar: ["present-perfect", "basic-questions"] },
        { pattern: "They have just arrived from {city}.", slots: { city: "cities" }, grammar: ["present-perfect"] },
        { pattern: "I have worked as a {profession} {duration}.", slots: { profession: "professions", duration: "duration" }, grammar: ["present-perfect"] },
        { pattern: "{name} has visited many {place}s.", slots: { name: "names", place: "places" }, grammar: ["present-perfect"] },
        { pattern: "I haven't seen that {object} yet.", slots: { object: "objects" }, grammar: ["present-perfect"] },

        // Past continuous
        { pattern: "I was reading when {name} called.", slots: { name: "names" }, grammar: ["past-continuous"] },
        { pattern: "They were sleeping when the {animal} started barking.", slots: { animal: "animals" }, grammar: ["past-continuous"] },
        { pattern: "What were you doing at the {place}?", slots: { place: "places" }, grammar: ["past-continuous", "basic-questions"] },
        { pattern: "{name} was cooking while the children were playing.", slots: { name: "names" }, grammar: ["past-continuous"] },

        // First conditional
        { pattern: "If it rains, I will stay at the {place}.", slots: { place: "places" }, grammar: ["first-conditional"] },
        { pattern: "If you study {abstractTopic}, you will find a good job.", slots: { abstractTopic: "abstractTopics" }, grammar: ["first-conditional"] },
        { pattern: "I will call {name} if I have time.", slots: { name: "names" }, grammar: ["first-conditional"] },
        { pattern: "If she doesn't hurry, she will miss the {object}.", slots: { object: "objects" }, grammar: ["first-conditional"] },
        { pattern: "What will you do if you visit {city}?", slots: { city: "cities" }, grammar: ["first-conditional", "basic-questions"] },

        // Opinions and feelings
        { pattern: "{opinionIntro} this {object} is {adjPositive}.", slots: { opinionIntro: "opinionIntro", object: "objects", adjPositive: "adjPositive" }, grammar: ["opinions"] },
        { pattern: "{opinionIntro} we should visit {city}.", slots: { opinionIntro: "opinionIntro", city: "cities" }, grammar: ["opinions", "modals-basic"] },
        { pattern: "I feel like eating {food}.", slots: { food: "foods" }, grammar: ["opinions"] },
        { pattern: "It seems that {name} has left the {place}.", slots: { name: "names", place: "places" }, grammar: ["opinions", "present-perfect"] },
        { pattern: "I'm afraid I can't help you with the {object}.", slots: { object: "objects" }, grammar: ["opinions", "modals-basic"] },

        // Reported speech
        { pattern: "{name} said that the {place} was {adjNeutral}.", slots: { name: "names", place: "places", adjNeutral: "adjNeutral" }, grammar: ["reported-speech-basic"] },
        { pattern: "She told me that she would visit {city}.", slots: { city: "cities" }, grammar: ["reported-speech-basic"] },
        { pattern: "They asked if we wanted to go to the {place}.", slots: { place: "places" }, grammar: ["reported-speech-basic"] },
        { pattern: "{name} mentioned that the {food} was {adjPositive}.", slots: { name: "names", food: "foods", adjPositive: "adjPositive" }, grammar: ["reported-speech-basic"] },

        // Purpose and reason
        { pattern: "I'm learning languages to travel to {country}.", slots: { country: "countries" }, grammar: ["purpose-reason"] },
        { pattern: "{name} went to the {place} to buy a {object}.", slots: { name: "names", place: "places", object: "objects" }, grammar: ["purpose-reason", "past-simple"] },
        { pattern: "I bought a {object} for my {relation}.", slots: { object: "objects", relation: "relations" }, grammar: ["purpose-reason", "past-simple"] },
        { pattern: "She exercises every day to stay {emotion}.", slots: { emotion: "emotions" }, grammar: ["purpose-reason", "present-simple"] },

        // Passive voice
        { pattern: "The {object} was made in {country}.", slots: { object: "objects", country: "countries" }, grammar: ["passive-basic"] },
        { pattern: "This {place} was built by my {relation}.", slots: { place: "places", relation: "relations" }, grammar: ["passive-basic"] },
        { pattern: "The {object} will be delivered {timeFuture}.", slots: { object: "objects", timeFuture: "timeFuture" }, grammar: ["passive-basic"] },
        { pattern: "{food} is eaten in many countries.", slots: { food: "foods" }, grammar: ["passive-basic"] },

        // Complex sentences
        { pattern: "Although the {food} was {adjNegative}, we ate it.", slots: { food: "foods", adjNegative: "adjNegative" }, grammar: ["relative-clauses-basic", "connectors-basic"] },
        { pattern: "I enjoy reading, especially about {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["present-simple"] },
        { pattern: "The {place} where we met is {adjNeutral}.", slots: { place: "places", adjNeutral: "adjNeutral" }, grammar: ["relative-clauses-basic"] },
        { pattern: "I remember the day when I visited {city}.", slots: { city: "cities" }, grammar: ["relative-clauses-basic"] },
        { pattern: "The {profession} who helped me was {adjPositive}.", slots: { profession: "professions", adjPositive: "adjPositive" }, grammar: ["relative-clauses-basic"] }
    ],

    B2: [
        // Second conditional
        { pattern: "If I had more time, I would learn about {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["second-conditional"] },
        { pattern: "If {name} were here, she would know what to do.", slots: { name: "names" }, grammar: ["second-conditional"] },
        { pattern: "What would you do if you lived in {city}?", slots: { city: "cities" }, grammar: ["second-conditional", "basic-questions"] },
        { pattern: "I would travel to {country} if I didn't have to work.", slots: { country: "countries" }, grammar: ["second-conditional"] },
        { pattern: "If I were you, I wouldn't buy that {object}.", slots: { object: "objects" }, grammar: ["second-conditional"] },

        // Third conditional
        { pattern: "If I had known about the {place}, I would have visited it.", slots: { place: "places" }, grammar: ["third-conditional"] },
        { pattern: "{name} would have succeeded if she had studied {abstractTopic}.", slots: { name: "names", abstractTopic: "abstractTopics" }, grammar: ["third-conditional"] },
        { pattern: "If they had left earlier, they wouldn't have missed the {object}.", slots: { object: "objects" }, grammar: ["third-conditional"] },
        { pattern: "I would have called {name} if I had had the {object}.", slots: { name: "names", object: "objects" }, grammar: ["third-conditional"] },

        // Past perfect
        { pattern: "I had never seen such a {adjPositive} {place} before.", slots: { adjPositive: "adjPositive", place: "places" }, grammar: ["past-perfect"] },
        { pattern: "By the time we arrived, {name} had already left.", slots: { name: "names" }, grammar: ["past-perfect"] },
        { pattern: "She realized she had forgotten her {object}.", slots: { object: "objects" }, grammar: ["past-perfect"] },
        { pattern: "He had been working as a {profession} for years before he quit.", slots: { profession: "professions" }, grammar: ["past-perfect"] },

        // Wishes
        { pattern: "I wish I could visit {city} more often.", slots: { city: "cities" }, grammar: ["wishes"] },
        { pattern: "If only I had learned about {abstractTopic} earlier.", slots: { abstractTopic: "abstractTopics" }, grammar: ["wishes"] },
        { pattern: "I wish {name} were here with me.", slots: { name: "names" }, grammar: ["wishes"] },
        { pattern: "She wishes she had more {abstractConcept}.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["wishes"] },
        { pattern: "I'd rather you didn't bring your {animal} to the {place}.", slots: { animal: "animals", place: "places" }, grammar: ["wishes"] },

        // Complex modals
        { pattern: "You should have told {name} about the {object}.", slots: { name: "names", object: "objects" }, grammar: ["modals-perfect"] },
        { pattern: "{name} must have forgotten about the {place}.", slots: { name: "names", place: "places" }, grammar: ["modals-perfect"] },
        { pattern: "They might have already left {city}.", slots: { city: "cities" }, grammar: ["modals-perfect"] },
        { pattern: "He could have been more {adjPositive}.", slots: { adjPositive: "adjPositive" }, grammar: ["modals-perfect"] },
        { pattern: "You needn't have worried about the {object}.", slots: { object: "objects" }, grammar: ["modals-perfect"] },

        // Relative clauses
        { pattern: "The {object} that I told you about is from {country}.", slots: { object: "objects", country: "countries" }, grammar: ["relative-clauses-advanced"] },
        { pattern: "The {place} in which {name} works is {adjPositive}.", slots: { place: "places", name: "names", adjPositive: "adjPositive" }, grammar: ["relative-clauses-advanced"] },
        { pattern: "That's the reason why I didn't go to the {place}.", slots: { place: "places" }, grammar: ["relative-clauses-advanced"] },
        { pattern: "My {relation}, whose {animal} always barks, moved to {city}.", slots: { relation: "relations", animal: "animals", city: "cities" }, grammar: ["relative-clauses-advanced"] },

        // Advanced passive
        { pattern: "The {object} is expected to be delivered {timeFuture}.", slots: { object: "objects", timeFuture: "timeFuture" }, grammar: ["passive-advanced"] },
        { pattern: "The {profession} is believed to have left the {place}.", slots: { profession: "professions", place: "places" }, grammar: ["passive-advanced"] },
        { pattern: "It is said that this {place} has the best {food}.", slots: { place: "places", food: "foods" }, grammar: ["passive-advanced"] },
        { pattern: "The {place} is being renovated at the moment.", slots: { place: "places" }, grammar: ["passive-advanced"] },

        // Abstract concepts
        { pattern: "The importance of {abstractTopic} cannot be overstated.", slots: { abstractTopic: "abstractTopics" }, grammar: ["abstract-concepts"] },
        { pattern: "{abstractConcept} often depends on {abstractConcept2}.", slots: { abstractConcept: "abstractConcepts", abstractConcept2: "abstractConcepts" }, grammar: ["abstract-concepts"] },
        { pattern: "The impact of {abstractTopic} on {abstractTopic2} has been profound.", slots: { abstractTopic: "abstractTopics", abstractTopic2: "abstractTopics" }, grammar: ["abstract-concepts"] },
        { pattern: "Cultural differences in {country} can be {adjPositive}.", slots: { country: "countries", adjPositive: "adjPositive" }, grammar: ["abstract-concepts"] }
    ],

    C1: [
        // Mixed conditionals
        { pattern: "If I had studied {abstractTopic} in school, I would have better {abstractConcept} now.", slots: { abstractTopic: "abstractTopics", abstractConcept: "abstractConcepts" }, grammar: ["mixed-conditionals"] },
        { pattern: "If {name} weren't so focused on {abstractConcept}, she would have accepted help.", slots: { name: "names", abstractConcept: "abstractConcepts" }, grammar: ["mixed-conditionals"] },
        { pattern: "If we had invested in {abstractTopic}, we would be more {adjPositive} now.", slots: { abstractTopic: "abstractTopics", adjPositive: "adjPositive" }, grammar: ["mixed-conditionals"] },

        // Inversion
        { pattern: "Never have I seen such {adjNegative} {abstractTopic}.", slots: { adjNegative: "adjNegative", abstractTopic: "abstractTopics" }, grammar: ["inversion"] },
        { pattern: "Not only did {name} arrive late, but she also forgot the {object}.", slots: { name: "names", object: "objects" }, grammar: ["inversion"] },
        { pattern: "Had I known about the {abstractTopic}, I would have acted sooner.", slots: { abstractTopic: "abstractTopics" }, grammar: ["inversion"] },
        { pattern: "Rarely do we get such an {abstractConcept} for {abstractTopic}.", slots: { abstractConcept: "abstractConcepts", abstractTopic: "abstractTopics" }, grammar: ["inversion"] },
        { pattern: "Under no circumstances should you ignore {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["inversion"] },

        // Cleft sentences
        { pattern: "What I need is some {abstractConcept} in my {place}.", slots: { abstractConcept: "abstractConcepts", place: "rooms" }, grammar: ["cleft-sentences"] },
        { pattern: "It was {name}'s approach to {abstractTopic} that bothered me.", slots: { name: "names", abstractTopic: "abstractTopics" }, grammar: ["cleft-sentences"] },
        { pattern: "What we should focus on is improving {abstractConcept}.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["cleft-sentences"] },
        { pattern: "It's not the {object} that concerns me, it's the {abstractConcept}.", slots: { object: "objects", abstractConcept: "abstractConcepts" }, grammar: ["cleft-sentences"] },

        // Nuanced expressions
        { pattern: "The proposal, while {adjPositive}, raises several concerns about {abstractTopic}.", slots: { adjPositive: "adjPositive", abstractTopic: "abstractTopics" }, grammar: ["nuanced-expressions"] },
        { pattern: "I couldn't help but notice the lack of {abstractConcept} in the {place}.", slots: { abstractConcept: "abstractConcepts", place: "places" }, grammar: ["nuanced-expressions"] },
        { pattern: "It goes without saying that {abstractConcept} is paramount in {abstractTopic}.", slots: { abstractConcept: "abstractConcepts", abstractTopic: "abstractTopics" }, grammar: ["nuanced-expressions"] },
        { pattern: "{name} came across as somewhat dismissive of our {abstractConcept}.", slots: { name: "names", abstractConcept: "abstractConcepts" }, grammar: ["nuanced-expressions"] },
        { pattern: "The situation calls for a more {adjPositive} approach to {abstractTopic}.", slots: { adjPositive: "adjPositive", abstractTopic: "abstractTopics" }, grammar: ["nuanced-expressions"] },

        // Hedging and politeness
        { pattern: "I was wondering if you might be able to help me with {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["hedging-politeness"] },
        { pattern: "It would appear that there has been some misunderstanding about the {object}.", slots: { object: "objects" }, grammar: ["hedging-politeness"] },
        { pattern: "I don't suppose you could share your {object} with {name}?", slots: { object: "objects", name: "names" }, grammar: ["hedging-politeness"] },
        { pattern: "Would you mind if I made a suggestion about {abstractTopic}?", slots: { abstractTopic: "abstractTopics" }, grammar: ["hedging-politeness"] },
        { pattern: "I'm inclined to think that we should reconsider our approach to {abstractConcept}.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["hedging-politeness"] },

        // Idiomatic expressions
        { pattern: "Let's not beat around the bush and discuss {abstractTopic} directly.", slots: { abstractTopic: "abstractTopics" }, grammar: ["idioms"] },
        { pattern: "The project about {abstractTopic} has been put on the back burner.", slots: { abstractTopic: "abstractTopics" }, grammar: ["idioms"] },
        { pattern: "{name} tends to sit on the fence when it comes to {abstractTopic}.", slots: { name: "names", abstractTopic: "abstractTopics" }, grammar: ["idioms"] },
        { pattern: "We need to think outside the box to improve {abstractConcept}.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["idioms"] },
        { pattern: "The news about {city} took everyone by surprise.", slots: { city: "cities" }, grammar: ["idioms"] },

        // Complex reasoning
        { pattern: "Given the circumstances in {country}, I believe we made the right decision.", slots: { country: "countries" }, grammar: ["complex-reasoning"] },
        { pattern: "In light of recent events in {abstractTopic}, we should reconsider our strategy.", slots: { abstractTopic: "abstractTopics" }, grammar: ["complex-reasoning"] },
        { pattern: "The evidence suggests that our assumptions about {abstractTopic} were incorrect.", slots: { abstractTopic: "abstractTopics" }, grammar: ["complex-reasoning"] },
        { pattern: "Despite the setbacks in {city}, the team remained committed to {abstractConcept}.", slots: { city: "cities", abstractConcept: "abstractConcepts" }, grammar: ["complex-reasoning"] },
        { pattern: "The findings have far-reaching implications for {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["complex-reasoning"] }
    ],

    C2: [
        // Literary and formal expressions
        { pattern: "The sheer audacity of the proposal regarding {abstractTopic} left the committee speechless.", slots: { abstractTopic: "abstractTopics" }, grammar: ["literary-formal"] },
        { pattern: "{name}'s reluctance to engage with {abstractTopic} proved costly.", slots: { name: "names", abstractTopic: "abstractTopics" }, grammar: ["literary-formal"] },
        { pattern: "The ramifications of such a decision on {abstractConcept} would be felt for generations.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["literary-formal"] },
        { pattern: "Her mastery of {abstractTopic} was evident in every response.", slots: { abstractTopic: "abstractTopics" }, grammar: ["literary-formal"] },
        { pattern: "The notion that {abstractConcept} is inevitable is increasingly being questioned.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["literary-formal"] },

        // Rare vocabulary and structures
        { pattern: "The organization's erstwhile allies in {country} have now become its fiercest critics.", slots: { country: "countries" }, grammar: ["rare-structures"] },
        { pattern: "Such hubris regarding {abstractTopic} invariably precedes a fall.", slots: { abstractTopic: "abstractTopics" }, grammar: ["rare-structures"] },
        { pattern: "The ostensible purpose of the meeting was to discuss {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["rare-structures"] },
        { pattern: "{name}'s equivocal response about {abstractConcept} did little to reassure anyone.", slots: { name: "names", abstractConcept: "abstractConcepts" }, grammar: ["rare-structures"] },
        { pattern: "The paucity of evidence regarding {abstractTopic} made it difficult to draw conclusions.", slots: { abstractTopic: "abstractTopics" }, grammar: ["rare-structures"] },

        // Philosophical and abstract
        { pattern: "The pursuit of {abstractConcept}, paradoxically, often impedes {abstractConcept2}.", slots: { abstractConcept: "abstractConcepts", abstractConcept2: "abstractConcepts" }, grammar: ["philosophical"] },
        { pattern: "Whether {abstractConcept} can be reduced to mere {abstractTopic} remains contentious.", slots: { abstractConcept: "abstractConcepts", abstractTopic: "abstractTopics" }, grammar: ["philosophical"] },
        { pattern: "The dichotomy between {abstractConcept} and {abstractConcept2} is a perennial tension.", slots: { abstractConcept: "abstractConcepts", abstractConcept2: "abstractConcepts" }, grammar: ["philosophical"] },
        { pattern: "Our perception of {abstractTopic} is necessarily mediated by our cognitive limitations.", slots: { abstractTopic: "abstractTopics" }, grammar: ["philosophical"] },
        { pattern: "The ephemeral nature of {abstractConcept} stands in stark contrast to lasting {abstractConcept2}.", slots: { abstractConcept: "abstractConcepts", abstractConcept2: "abstractConcepts" }, grammar: ["philosophical"] },

        // Complex syntax
        { pattern: "That the committee chose to disregard such compelling evidence about {abstractTopic} speaks volumes.", slots: { abstractTopic: "abstractTopics" }, grammar: ["complex-syntax"] },
        { pattern: "Were the circumstances in {country} any different, I might have been inclined to agree.", slots: { country: "countries" }, grammar: ["complex-syntax"] },
        { pattern: "Suffice it to say that the situation regarding {abstractTopic} is considerably more nuanced.", slots: { abstractTopic: "abstractTopics" }, grammar: ["complex-syntax"] },
        { pattern: "The degree to which {abstractConcept} and {abstractTopic} interact remains poorly understood.", slots: { abstractConcept: "abstractConcepts", abstractTopic: "abstractTopics" }, grammar: ["complex-syntax"] },
        { pattern: "Not until the full extent of the impact on {abstractConcept} became apparent did authorities act.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["complex-syntax"] },

        // Sophisticated argumentation
        { pattern: "While conceding the validity of certain objections, one must acknowledge the merits of {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["argumentation"] },
        { pattern: "The argument about {abstractConcept}, however ingenious, rests on a questionable premise.", slots: { abstractConcept: "abstractConcepts" }, grammar: ["argumentation"] },
        { pattern: "It would be remiss not to point out the inherent contradictions in this approach to {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["argumentation"] },
        { pattern: "The proposal regarding {country}, notwithstanding its simplicity, raises profound questions.", slots: { country: "countries" }, grammar: ["argumentation"] },
        { pattern: "Any assessment of {abstractTopic} must take into account its unintended consequences.", slots: { abstractTopic: "abstractTopics" }, grammar: ["argumentation"] },

        // Cultural and literary references
        { pattern: "Like a phoenix rising from the ashes, {city} reinvented itself.", slots: { city: "cities" }, grammar: ["literary-references"] },
        { pattern: "The irony of the situation regarding {abstractTopic} was not lost on those present.", slots: { abstractTopic: "abstractTopics" }, grammar: ["literary-references"] },
        { pattern: "{name}'s Sisyphean efforts to reform {abstractTopic} ultimately proved futile.", slots: { name: "names", abstractTopic: "abstractTopics" }, grammar: ["literary-references"] },
        { pattern: "The Kafkaesque bureaucracy in {country} left citizens feeling powerless.", slots: { country: "countries" }, grammar: ["literary-references"] },
        { pattern: "There is a certain quixotic charm to such idealistic endeavors in {abstractTopic}.", slots: { abstractTopic: "abstractTopics" }, grammar: ["literary-references"] }
    ]
};

// ============================================================================
// CONVERSATION PROMPTS - For response practice
// ============================================================================

const conversationPrompts = {
    A1: [
        // Greetings
        {
            prompt: "Hello! How are you?",
            respondWith: "Say you're fine and return the greeting",
            responses: ["I'm fine, thank you. And you?", "I'm good, thanks! How are you?", "Fine, thanks. And you?", "Good, thank you!"],
            grammar: ["greetings-responses"],
            keywords: ["fine", "good", "thanks", "thank", "you"]
        },
        {
            prompt: "Good morning!",
            respondWith: "Return the greeting",
            responses: ["Good morning!", "Good morning! How are you?", "Morning!"],
            grammar: ["greetings-responses"],
            keywords: ["morning", "good"]
        },
        {
            prompt: "Nice to meet you.",
            respondWith: "Say it's nice to meet them too",
            responses: ["Nice to meet you too.", "Pleased to meet you.", "Nice to meet you as well.", "The pleasure is mine."],
            grammar: ["greetings-responses", "polite-expressions"],
            keywords: ["nice", "meet", "pleasure", "pleased"]
        },
        {
            prompt: "What is your name?",
            respondWith: "Tell them your name (use any name)",
            responses: ["My name is Maria.", "I'm John.", "I am called Sofia.", "My name's Alex."],
            grammar: ["basic-questions-responses", "present-simple-be"],
            keywords: ["name", "is", "am", "I'm", "called"]
        },
        {
            prompt: "Where are you from?",
            respondWith: "Say where you are from (use any country/city)",
            responses: ["I'm from Spain.", "I am from New York.", "I come from Germany.", "I'm from Tokyo."],
            grammar: ["basic-questions-responses", "present-simple-be"],
            keywords: ["from", "I'm", "am", "come"]
        },
        {
            prompt: "Thank you very much!",
            respondWith: "Say you're welcome",
            responses: ["You're welcome!", "No problem!", "My pleasure!", "Don't mention it."],
            grammar: ["polite-expressions"],
            keywords: ["welcome", "problem", "pleasure", "mention"]
        },
        {
            prompt: "I'm sorry.",
            respondWith: "Say it's okay / no problem",
            responses: ["It's okay.", "No problem.", "Don't worry about it.", "That's alright."],
            grammar: ["polite-expressions"],
            keywords: ["okay", "problem", "worry", "alright", "fine"]
        },
        {
            prompt: "Do you speak English?",
            respondWith: "Say yes, a little",
            responses: ["Yes, a little.", "Yes, I do.", "A little bit.", "Yes, I speak some English."],
            grammar: ["basic-questions-responses", "present-simple"],
            keywords: ["yes", "little", "bit", "some"]
        }
    ],

    A2: [
        // Yes/No questions
        {
            prompt: "Do you like coffee?",
            respondWith: "Say yes and that you drink it every morning",
            responses: ["Yes, I love coffee. I drink it every morning.", "Yes, I like it a lot. I have it every morning.", "Yes! I drink coffee every morning."],
            grammar: ["yes-no-responses", "present-simple", "frequency-adverbs"],
            keywords: ["yes", "coffee", "morning", "drink", "every"]
        },
        {
            prompt: "Can you help me?",
            respondWith: "Say yes, of course, and ask what they need",
            responses: ["Yes, of course! What do you need?", "Sure! How can I help?", "Of course! What can I do for you?"],
            grammar: ["yes-no-responses", "modals-basic"],
            keywords: ["yes", "course", "sure", "help", "need", "what"]
        },
        {
            prompt: "Would you like to go to the cinema tonight?",
            respondWith: "Accept the invitation enthusiastically",
            responses: ["Yes, I'd love to!", "That sounds great!", "Sure, what time?", "Yes, that would be fun!"],
            grammar: ["invitation-responses", "future-going-to"],
            keywords: ["yes", "love", "great", "sure", "sounds", "fun"]
        },
        {
            prompt: "Would you like to go to the cinema tonight?",
            respondWith: "Politely decline, saying you're busy",
            responses: ["I'm sorry, I can't. I'm busy tonight.", "Thanks, but I have plans tonight.", "I'd love to, but I can't tonight.", "Sorry, maybe another time?"],
            grammar: ["invitation-responses", "modals-basic"],
            keywords: ["sorry", "can't", "busy", "plans", "another"]
        },
        {
            prompt: "What do you do for work?",
            respondWith: "Say your job (use any profession)",
            responses: ["I'm a teacher.", "I work as an engineer.", "I'm a doctor.", "I work in an office."],
            grammar: ["basic-questions-responses", "present-simple"],
            keywords: ["I'm", "work", "am"]
        },
        {
            prompt: "What are you doing this weekend?",
            respondWith: "Say you're visiting family",
            responses: ["I'm visiting my family.", "I'm going to visit my parents.", "I'm spending time with my family.", "I have plans with my family."],
            grammar: ["present-continuous", "future-going-to"],
            keywords: ["visiting", "family", "going", "parents", "spending"]
        },
        {
            prompt: "How was your day?",
            respondWith: "Say it was good but tiring",
            responses: ["It was good, but tiring.", "Pretty good, but I'm tired.", "Good, thanks! A bit exhausting though.", "It was nice but long."],
            grammar: ["past-simple", "connectors-basic"],
            keywords: ["good", "tiring", "tired", "exhausting", "but"]
        },
        {
            prompt: "What time is it?",
            respondWith: "Say it's 3 o'clock",
            responses: ["It's 3 o'clock.", "It's three.", "Three o'clock.", "It's 3 PM."],
            grammar: ["basic-questions-responses", "numbers"],
            keywords: ["three", "3", "o'clock"]
        }
    ],

    B1: [
        // Opinions
        {
            prompt: "What do you think about social media?",
            respondWith: "Give a balanced opinion - some good and bad points",
            responses: [
                "I think it has both advantages and disadvantages. It's good for staying connected, but it can be addictive.",
                "In my opinion, it's useful for communication, but we shouldn't spend too much time on it.",
                "I believe it can be helpful, but it also has some negative effects on people."
            ],
            grammar: ["opinion-responses", "opinions", "connectors-basic"],
            keywords: ["think", "opinion", "believe", "but", "good", "bad", "advantages", "disadvantages"]
        },
        {
            prompt: "I think we should take a taxi.",
            respondWith: "Disagree politely and suggest walking instead",
            responses: [
                "I'm not sure about that. The weather is nice, so why don't we walk?",
                "Actually, I think we should walk. It's not far and it's a beautiful day.",
                "I'd prefer to walk, if you don't mind. It's not that far."
            ],
            grammar: ["suggestion-responses", "opinions", "modals-basic"],
            keywords: ["walk", "prefer", "think", "not sure", "actually"]
        },
        {
            prompt: "Sorry, I didn't understand. Could you repeat that?",
            respondWith: "Say of course and offer to speak more slowly",
            responses: [
                "Of course! I'll speak more slowly.",
                "Sure, no problem. Let me say it again more slowly.",
                "Yes, of course. I'll repeat it."
            ],
            grammar: ["clarification-responses", "modals-basic"],
            keywords: ["course", "sure", "slowly", "repeat", "again"]
        },
        {
            prompt: "I just got a promotion at work!",
            respondWith: "Congratulate them enthusiastically",
            responses: [
                "Congratulations! That's wonderful news!",
                "That's amazing! Well done!",
                "How exciting! Congratulations!",
                "That's great news! You deserve it!"
            ],
            grammar: ["emotion-responses"],
            keywords: ["congratulations", "wonderful", "amazing", "great", "exciting", "deserve"]
        },
        {
            prompt: "My grandmother passed away last week.",
            respondWith: "Express sympathy",
            responses: [
                "I'm so sorry to hear that. My condolences.",
                "I'm very sorry for your loss.",
                "That's terrible. I'm here if you need anything.",
                "I'm so sorry. Please let me know if I can help."
            ],
            grammar: ["emotion-responses"],
            keywords: ["sorry", "condolences", "loss", "here", "help"]
        },
        {
            prompt: "Have you ever been to Japan?",
            respondWith: "Say no, but you'd love to go someday",
            responses: [
                "No, I haven't, but I'd love to go someday.",
                "Not yet, but it's on my bucket list!",
                "No, but I've always wanted to visit Japan.",
                "I haven't, but I hope to go one day."
            ],
            grammar: ["present-perfect", "first-conditional"],
            keywords: ["no", "haven't", "love", "want", "hope", "someday", "visit"]
        },
        {
            prompt: "Why don't we have lunch together?",
            respondWith: "Accept and suggest a restaurant",
            responses: [
                "That sounds great! How about that Italian place nearby?",
                "Good idea! There's a nice café around the corner.",
                "Sure! Do you know any good restaurants around here?"
            ],
            grammar: ["suggestion-responses", "invitation-responses"],
            keywords: ["sounds", "great", "good", "idea", "sure", "restaurant", "place", "café"]
        }
    ],

    B2: [
        // Negotiation and persuasion
        {
            prompt: "I think we should postpone the meeting until next week.",
            respondWith: "Partially agree but suggest a compromise - maybe just delay by two days",
            responses: [
                "I see your point, but what if we just pushed it back by two days instead?",
                "I understand, but perhaps we could delay it until Wednesday rather than next week?",
                "That might be too long. How about we reschedule for Thursday?"
            ],
            grammar: ["negotiation-responses", "second-conditional"],
            keywords: ["understand", "but", "what if", "perhaps", "instead", "rather", "how about"]
        },
        {
            prompt: "I don't think this project is worth pursuing.",
            respondWith: "Respectfully disagree and give a reason to continue",
            responses: [
                "I understand your concerns, but I think we should give it more time. The initial results look promising.",
                "I see where you're coming from, but the potential benefits outweigh the risks in my view.",
                "While I respect your opinion, I believe we shouldn't give up yet. We've made good progress."
            ],
            grammar: ["persuasion-responses", "opinions"],
            keywords: ["understand", "but", "think", "believe", "potential", "progress", "promising"]
        },
        {
            prompt: "If you could live anywhere in the world, where would you choose?",
            respondWith: "Name a place and explain why",
            responses: [
                "I'd probably choose somewhere coastal, like Portugal. I love the sea and the weather there is perfect.",
                "I think I'd live in Japan. The culture fascinates me and I love Japanese food.",
                "I'd choose Canada. It has beautiful nature and people are very friendly there."
            ],
            grammar: ["second-conditional", "opinions"],
            keywords: ["choose", "probably", "think", "love", "because", "would"]
        },
        {
            prompt: "What would you have done differently if you were me?",
            respondWith: "Give thoughtful advice about what you would have done",
            responses: [
                "If I had been in your situation, I might have waited a bit longer before making a decision.",
                "I think I would have asked for more opinions before deciding.",
                "Honestly, I probably would have done the same thing. It was a difficult situation."
            ],
            grammar: ["third-conditional", "modals-perfect"],
            keywords: ["would have", "might have", "if", "situation", "probably"]
        },
        {
            prompt: "The service at this restaurant is terrible!",
            respondWith: "Agree but suggest staying calm and speaking to the manager",
            responses: [
                "You're right, it's not great. Maybe we should speak to the manager calmly.",
                "I agree, it's disappointing. Let's ask to speak with someone in charge.",
                "Yes, it could be better. Perhaps we should mention it politely before we leave."
            ],
            grammar: ["opinion-responses", "suggestion-responses"],
            keywords: ["agree", "right", "maybe", "should", "speak", "manager", "politely"]
        }
    ],

    C1: [
        // Diplomatic and nuanced responses
        {
            prompt: "Your presentation was interesting, but I'm not sure the data supports your conclusions.",
            respondWith: "Acknowledge the criticism gracefully and offer to provide more evidence",
            responses: [
                "That's a fair point. I'd be happy to share the additional research that led me to these conclusions.",
                "I appreciate the feedback. Perhaps I didn't make the connection clear enough - I can provide more supporting data.",
                "Thank you for raising that. You make a valid point, and I'll make sure to strengthen the evidence in my next draft."
            ],
            grammar: ["diplomatic-responses", "hedging-politeness"],
            keywords: ["appreciate", "fair", "point", "happy", "provide", "evidence", "valid"]
        },
        {
            prompt: "I've heard that you're not happy with how the project is being managed.",
            respondWith: "Diplomatically address the concern without being negative",
            responses: [
                "I wouldn't say unhappy, but I do think there's room for improvement in our communication processes.",
                "I have some concerns, which I'd prefer to discuss directly with the team rather than through rumors.",
                "That's not quite accurate. I've raised some suggestions for improvement, but I support the project overall."
            ],
            grammar: ["diplomatic-responses", "nuanced-expressions"],
            keywords: ["wouldn't", "concerns", "improvement", "prefer", "rather", "suggestions"]
        },
        {
            prompt: "Don't you think working from home is less productive than being in the office?",
            respondWith: "Challenge the assumption diplomatically while acknowledging both sides",
            responses: [
                "I think it really depends on the individual and the type of work. Some tasks benefit from collaboration, while others require deep focus.",
                "I'd hesitate to make such a blanket statement. The research actually shows mixed results depending on the context.",
                "That's an interesting assumption, but my experience has been quite different. Perhaps it varies by industry."
            ],
            grammar: ["diplomatic-responses", "complex-reasoning"],
            keywords: ["depends", "think", "hesitate", "actually", "experience", "perhaps", "varies"]
        }
    ],

    C2: [
        {
            prompt: "Some argue that artificial intelligence will eventually make human workers obsolete. What's your take on this?",
            respondWith: "Give a sophisticated, nuanced response considering multiple perspectives",
            responses: [
                "While I understand the concern, I'd argue that historical precedent suggests technology tends to transform rather than eliminate human labor. That said, the pace of change this time may indeed prove qualitatively different.",
                "It's a provocative thesis, but I think it oversimplifies the relationship between technological capability and economic reality. The question isn't whether AI can replace humans, but whether doing so would be desirable or even feasible.",
                "I find such deterministic predictions somewhat reductive. Human work encompasses far more than can be captured by efficiency metrics alone."
            ],
            grammar: ["philosophical", "argumentation"],
            keywords: ["while", "argue", "indeed", "oversimplifies", "question", "whether", "encompasses"]
        }
    ]
};

// ============================================================================
// SENTENCE GENERATION ENGINE
// ============================================================================

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateSentence(level, targetGrammar = null) {
    const templates = grammarTemplates[level];
    if (!templates || templates.length === 0) {
        return { sentence: "Hello, how are you?", grammar: ["greetings"] };
    }

    let template;

    // If targeting specific grammar, filter templates
    if (targetGrammar) {
        const filtered = templates.filter(t => t.grammar.includes(targetGrammar));
        template = filtered.length > 0 ? pickRandom(filtered) : pickRandom(templates);
    } else {
        template = pickRandom(templates);
    }

    let sentence = template.pattern;

    // Track used values to avoid repetition within the same sentence
    const usedValues = {};

    // Replace all slots with random vocabulary
    for (const [slotName, vocabKey] of Object.entries(template.slots)) {
        // Handle numbered slots (e.g., city2, food2) - they should use the same vocab pool
        const baseKey = vocabKey.replace(/\d+$/, '');
        const vocabArray = vocab[baseKey] || vocab[vocabKey];

        if (vocabArray) {
            let value;
            let attempts = 0;

            // Try to pick a value that hasn't been used (to avoid "Paris is bigger than Paris")
            do {
                value = pickRandom(vocabArray);
                attempts++;
            } while (usedValues[baseKey]?.includes(value) && attempts < 10);

            // Track the used value
            if (!usedValues[baseKey]) {
                usedValues[baseKey] = [];
            }
            usedValues[baseKey].push(value);

            // Replace the placeholder
            const placeholder = `{${slotName}}`;
            sentence = sentence.replace(placeholder, value);
        }
    }

    return {
        sentence: sentence,
        grammar: template.grammar
    };
}

// Legacy function for backwards compatibility
function getRandomSentence(level, targetGrammar = null) {
    const result = generateSentence(level, targetGrammar);
    return result.sentence;
}

// New function that returns full sentence info including grammar
function getRandomSentenceWithGrammar(level, targetGrammar = null) {
    return generateSentence(level, targetGrammar);
}

// Get a random conversation prompt for response practice
function getRandomConversationPrompt(level, targetGrammar = null) {
    const prompts = conversationPrompts[level];
    if (!prompts || prompts.length === 0) {
        // Fallback to A1 if level has no prompts
        const fallbackPrompts = conversationPrompts['A1'];
        if (!fallbackPrompts || fallbackPrompts.length === 0) {
            return null;
        }
        return pickRandom(fallbackPrompts);
    }

    // If targeting specific grammar, filter prompts
    if (targetGrammar) {
        const filtered = prompts.filter(p => p.grammar.includes(targetGrammar));
        if (filtered.length > 0) {
            return pickRandom(filtered);
        }
    }

    return pickRandom(prompts);
}

// Get a mixed question - either translation or conversation (weighted)
function getRandomQuestion(level, targetGrammar = null) {
    // 30% chance of conversation prompt, 70% translation
    // This keeps conversation practice integrated but not overwhelming
    const conversationChance = 0.3;

    // Check if we have conversation prompts for this level
    const hasConversationPrompts = conversationPrompts[level] && conversationPrompts[level].length > 0;

    if (hasConversationPrompts && Math.random() < conversationChance) {
        const prompt = getRandomConversationPrompt(level, targetGrammar);
        if (prompt) {
            return {
                type: 'respond',
                prompt: prompt.prompt,
                respondWith: prompt.respondWith,
                responses: prompt.responses,
                grammar: prompt.grammar,
                keywords: prompt.keywords || []
            };
        }
    }

    // Default to translation
    const sentence = generateSentence(level, targetGrammar);
    return {
        type: 'translate',
        sentence: sentence.sentence,
        grammar: sentence.grammar
    };
}

function getAvailableLevels() {
    return Object.keys(grammarTemplates);
}

function getGrammarCategories() {
    return grammarCategories;
}

function getGrammarCategoriesForLevel(level) {
    return Object.entries(grammarCategories)
        .filter(([key, cat]) => cat.level === level)
        .map(([key, cat]) => ({ id: key, ...cat }));
}

// Calculate approximate number of possible sentences per level
function estimateSentenceCount(level) {
    const templates = grammarTemplates[level];
    if (!templates) return 0;

    let total = 0;
    for (const template of templates) {
        let combinations = 1;
        for (const vocabKey of Object.values(template.slots)) {
            const baseKey = vocabKey.replace(/\d+$/, '');
            const vocabArray = vocab[baseKey] || vocab[vocabKey];
            if (vocabArray) {
                combinations *= vocabArray.length;
            }
        }
        total += combinations;
    }
    return total;
}

// Log estimated counts (for debugging)
function logSentenceCounts() {
    console.log("Estimated unique sentences per level:");
    for (const level of getAvailableLevels()) {
        console.log(`  ${level}: ${estimateSentenceCount(level).toLocaleString()}`);
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        vocab,
        grammarTemplates,
        grammarCategories,
        conversationPrompts,
        generateSentence,
        getRandomSentence,
        getRandomSentenceWithGrammar,
        getRandomConversationPrompt,
        getRandomQuestion,
        getAvailableLevels,
        getGrammarCategories,
        getGrammarCategoriesForLevel,
        estimateSentenceCount
    };
}
