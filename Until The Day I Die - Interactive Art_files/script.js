class FlapBoard {
    constructor() {
        this.currentIndex = 0;
        this.rows = [
            document.getElementById('row1'),
            document.getElementById('row2'),
            document.getElementById('row3'),
            document.getElementById('row4')
        ];
        
        // Each message specifies which rows to use [row1Index, row2Index] and the text for those rows
        this.messages = [
            { rows: [1, 2], text: ['I WANT YOU TO STAY', 'TIL I\'M IN THE GRAVE'] },
            { rows: [2, 3], text: ['TIL I ROT AWAY', 'DEAD AND BURIED'] },
            { rows: [1, 2], text: ['TIL I\'M IN THE CASKET', 'YOU CARRY'] },
            { rows: [2, 3], text: ['IF YOU GO I\'M GOING TOO', 'CAUSE IT WAS ALWAYS YOU'] },
            { rows: [1, 2], text: ['AND IF I\'M TURNIN BLUE', 'PLEASE DON\'T SAVE ME'] },
            { rows: [2, 3], text: ['NOTHING LEFT TO LOSE', 'WITHOUT MY BABY'] },
            { rows: [1, 2], text: ['BIRDS OF A FEATHER', 'WE SHOULD STICK TOGETHER'] },
            { rows: [2, 3], text: ['I SAID I\'D NEVER THINK', 'I WASN\'T BETTER ALONE'] },
            { rows: [1, 2], text: ['CAN\'T CHANGE THE WEATHER', 'MIGHT NOT BE FOREVER'] },
            { rows: [2, 3], text: ['BUT IF IT\'S FOREVER', 'IT\'S EVEN BETTER'] },
            { rows: [1, 2], text: ['AND I DON\'T KNOW WHAT', 'I\'M CRYING FOR'] },
            { rows: [2, 3], text: ['I DON\'T THINK I COULD', 'LOVE YOU MORE'] },
            { rows: [1, 2], text: ['IT MIGHT NOT BE LONG', 'BUT BABY I'] },
            { rows: [2, 3], text: ['I\'LL LOVE YOU TIL', 'THE DAY THAT I DIE'] },
            { rows: [1, 2], text: ['TIL THE DAY THAT I DIE', 'TIL THE LIGHT LEAVES MY EYES'] },
            { rows: [2, 3], text: ['TIL THE DAY THAT I DIE', 'I WANT YOU TO SEE'] },
            { rows: [1, 2], text: ['HOW YOU LOOK TO ME', 'YOU WOULDN\'T BELIEVE'] },
            { rows: [2, 3], text: ['IF I TOLD YA YOU\'D KEEP', 'THE COMPLIMENTS I THROW YA'] },
            { rows: [1, 2], text: ['BUT YOU\'RE SO FULL OF IT', 'TELL ME IT\'S A BIT NO'] },
            { rows: [2, 3], text: ['SAY YOU DON\'T SEE IT', 'YOUR MIND\'S POLLUTED'] },
            { rows: [1, 2], text: ['SAY YOU WANNA QUIT', 'DON\'T BE STUPID'] },
            { rows: [2, 3], text: ['I KNEW YOU IN', 'ANOTHER LIFE'] },
            { rows: [1, 2], text: ['YOU HAD THAT SAME', 'LOOK IN YOUR EYES'] },
            { rows: [2, 3], text: ['I LOVE YOU DON\'T', 'ACT SO SURPRISED'] }
        ];

        this.initializeBoard();
        this.setupEventListeners();
        this.displayCurrentMessage();
    }

    initializeBoard() {
        // Create exactly 30 flaps per row
        this.rows.forEach(row => {
            for (let i = 0; i < 30; i++) {
                const flap = document.createElement('div');
                flap.className = 'flap empty';
                
                const flapTop = document.createElement('div');
                flapTop.className = 'flap-top';
                
                const flapBottom = document.createElement('div');
                flapBottom.className = 'flap-bottom';
                
                flap.appendChild(flapTop);
                flap.appendChild(flapBottom);
                row.appendChild(flap);
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.nextMessage();
            } else if (e.key === 'ArrowLeft') {
                this.previousMessage();
            }
        });
    }

    async flipCharacter(flap, newChar, isActive) {
        // Generate random number of flips (4-6 for smoother effect)
        const flips = Math.floor(Math.random() * 3) + 4;
        
        // Store the current character
        const currentChar = flap.querySelector('.flap-bottom').textContent;
        
        // Only proceed if the character is actually changing
        if (currentChar === newChar && isActive) {
            return;
        }

        // Clear any existing animations
        flap.classList.remove('empty');
        
        for (let i = 0; i < flips; i++) {
            const isLastFlip = i === flips - 1;
            const char = isLastFlip ? newChar : String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            
            // Set the next character before the flip
            const topFlap = flap.querySelector('.flap-top');
            const bottomFlap = flap.querySelector('.flap-bottom');
            
            // Update content with proper timing
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    if (!isLastFlip || isActive) {
                        topFlap.textContent = char;
                        bottomFlap.textContent = char;
                    } else {
                        topFlap.textContent = '';
                        bottomFlap.textContent = '';
                    }
                    resolve();
                });
            });
            
            flap.classList.add('flipping');
            
            // Slower flip duration for more mechanical feel
            await new Promise(resolve => setTimeout(resolve, 250));
            
            flap.classList.remove('flipping');
            
            // Shorter pause between flips
            await new Promise(resolve => setTimeout(resolve, 20));
        }

        if (!isActive) {
            flap.classList.add('empty');
            requestAnimationFrame(() => {
                flap.querySelector('.flap-top').textContent = '';
                flap.querySelector('.flap-bottom').textContent = '';
            });
        }
    }

    async displayCurrentMessage() {
        const currentMessage = this.messages[this.currentIndex];
        const nextMessage = this.messages[(this.currentIndex + 1) % this.messages.length];
        
        // Reset all rows to inactive
        this.rows.forEach(row => {
            row.classList.remove('active');
        });
        
        // Activate the rows being used
        currentMessage.rows.forEach(rowIndex => {
            this.rows[rowIndex].classList.add('active');
        });

        // Process all rows
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            const row = this.rows[rowIndex];
            const isActiveRow = currentMessage.rows.includes(rowIndex);
            const willBeActiveInNext = nextMessage.rows.includes(rowIndex);
            const messageText = isActiveRow ? 
                currentMessage.text[currentMessage.rows.indexOf(rowIndex)] : '';
            
            const flaps = Array.from(row.querySelectorAll('.flap'));
            
            if (isActiveRow) {
                // Split message into words
                const words = messageText.split(' ');
                let currentPosition = 0;
                
                // Group words for simultaneous animation
                while (currentPosition < words.length) {
                    const wordGroup = words.slice(currentPosition, currentPosition + 2);
                    const groupLength = wordGroup.reduce((acc, word) => acc + word.length + 1, 0) - 1;
                    const startPos = currentPosition === 0 ? 0 : 
                        words.slice(0, currentPosition).reduce((acc, word) => acc + word.length + 1, 0);
                    
                    // Create promises for all characters in the word group
                    const groupFlaps = flaps.slice(startPos, startPos + groupLength);
                    const flipPromises = [];
                    
                    let charPosition = 0;
                    for (const word of wordGroup) {
                        const wordFlips = [];
                        for (let i = 0; i < word.length; i++) {
                            const flap = groupFlaps[charPosition];
                            if (flap) {
                                // Reduced delay range (300-800ms) for smoother transitions
                                const delay = 300 + Math.random() * 500;
                                wordFlips.push(
                                    new Promise(resolve => {
                                        setTimeout(() => {
                                            this.flipCharacter(flap, word[i], true).then(resolve);
                                        }, delay);
                                    })
                                );
                            }
                            charPosition++;
                        }
                        // Add all characters of the word to promises
                        flipPromises.push(...wordFlips);
                        
                        // Add space after word if not last word
                        if (charPosition < groupLength) {
                            const spaceFlap = groupFlaps[charPosition];
                            if (spaceFlap) {
                                const spaceDelay = 300 + Math.random() * 200;
                                flipPromises.push(
                                    new Promise(resolve => {
                                        setTimeout(() => {
                                            this.flipCharacter(spaceFlap, ' ', true).then(resolve);
                                        }, spaceDelay);
                                    })
                                );
                            }
                            charPosition++;
                        }
                    }
                    
                    // Wait for all characters in the group to complete
                    await Promise.all(flipPromises);
                    currentPosition += wordGroup.length;
                }
                
                // Clear any remaining flaps in the row
                const clearPromises = [];
                for (let i = messageText.length; i < flaps.length; i++) {
                    const flap = flaps[i];
                    const delay = 300 + Math.random() * 500;
                    clearPromises.push(
                        new Promise(resolve => {
                            setTimeout(() => {
                                this.flipCharacter(flap, '', false).then(resolve);
                            }, delay);
                        })
                    );
                }
                await Promise.all(clearPromises);
            } else if (willBeActiveInNext) {
                // Only animate flaps that will be active in the next message
                const nextText = nextMessage.text[nextMessage.rows.indexOf(rowIndex)] || '';
                const animationPromises = [];
                flaps.forEach((flap, i) => {
                    if (i < nextText.length && Math.random() < 0.4) { // Further reduced animation probability
                        const delay = 300 + Math.random() * 800;
                        animationPromises.push(
                            new Promise(resolve => {
                                setTimeout(() => {
                                    this.flipCharacter(flap, '', false).then(resolve);
                                }, delay);
                            })
                        );
                    } else {
                        requestAnimationFrame(() => {
                            flap.classList.add('empty');
                            flap.querySelector('.flap-top').textContent = '';
                            flap.querySelector('.flap-bottom').textContent = '';
                        });
                    }
                });
                await Promise.all(animationPromises);
            }
        }
    }

    async nextMessage() {
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;
        await this.displayCurrentMessage();
    }

    async previousMessage() {
        this.currentIndex = (this.currentIndex - 1 + this.messages.length) % this.messages.length;
        await this.displayCurrentMessage();
    }
}

// Initialize the flapboard when the page loads
window.addEventListener('load', () => {
    new FlapBoard();
}); 