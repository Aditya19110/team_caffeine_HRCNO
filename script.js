let workTimer;
let breakTimer;
let isBreakTime = false;
let isRunning = false;
let workMinutes = 25;
let workSeconds = 0;
let breakMinutes = 5;
let breakSeconds = 0;

const currentTheme = localStorage.getItem('theme') || 'theme-light';
document.body.classList.add(currentTheme);

function updateTimer() {
    const timerDisplay = document.getElementById('timer');
    const breakTimerDisplay = document.getElementById('break-timer-display');

    if (isBreakTime) {
        breakTimerDisplay.textContent = `${breakMinutes.toString().padStart(2, '0')}:${breakSeconds.toString().padStart(2, '0')}`;
    } else {
        timerDisplay.textContent = `${workMinutes.toString().padStart(2, '0')}:${workSeconds.toString().padStart(2, '0')}`;
    }
}

function playSound() {
    const audio = new Audio('notification.mp3'); 
    audio.play();
}

function startPomodoro() {
    if (!isRunning) {
        workMinutes = parseInt(document.getElementById('work-minutes').value, 10) || 25;
        workSeconds = parseInt(document.getElementById('work-seconds').value, 10) || 0;
        breakMinutes = parseInt(document.getElementById('break-minutes').value, 10) || 5;
        breakSeconds = parseInt(document.getElementById('break-seconds').value, 10) || 0;

        if (workMinutes < 0 || workSeconds < 0 || breakMinutes < 0 || breakSeconds < 0) {
            alert('Please enter non-negative values for work and break time.');
            return;
        }

        updateTimer();

        workTimer = setInterval(function () {
            if (workMinutes === 0 && workSeconds === 0) {
                clearInterval(workTimer);
                playSound();
                alert('Pomodoro session completed! Take a break.');
                resetPomodoro();
                startBreak();
            } else {
                if (workSeconds === 0) {
                    workMinutes--;
                    workSeconds = 59;
                } else {
                    workSeconds--;
                }
                updateTimer();
            }
        }, 1000);

        saveSessionToHistory('Pomodoro', workMinutes, workSeconds);
        isRunning = true;
    }
}

function resetPomodoro() {
    clearInterval(workTimer);
    clearInterval(breakTimer);
    isRunning = false;
    isBreakTime = false;

    workMinutes = parseInt(document.getElementById('work-minutes').value, 10) || 25;
    workSeconds = parseInt(document.getElementById('work-seconds').value, 10) || 0;

    updateTimer();
    hideBreakTimer();
}

function startBreak() {
    isBreakTime = true;
    breakMinutes = parseInt(document.getElementById('break-minutes').value, 10) || 5;
    breakSeconds = parseInt(document.getElementById('break-seconds').value, 10) || 0;

    updateTimer();

    breakTimer = setInterval(function () {
        if (breakMinutes === 0 && breakSeconds === 0) {
            clearInterval(breakTimer);
            playSound();
            alert('Break time completed! Back to work.');
            resetPomodoro();
        } else {
            if (breakSeconds === 0) {
                breakMinutes--;
                breakSeconds = 59;
            } else {
                breakSeconds--;
            }
            updateTimer();
        }
    }, 1000);

    saveSessionToHistory('Break', breakMinutes, breakSeconds);
    showBreakTimer();
}

function showBreakTimer() {
    const breakTimerDisplay = document.getElementById('break-timer-display');
    breakTimerDisplay.style.display = 'block';
}

function hideBreakTimer() {
    const breakTimerDisplay = document.getElementById('break-timer-display');
    breakTimerDisplay.style.display = 'none';
}

function saveSessionToHistory(type, minutes, seconds) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${type} Session - ${minutes} minutes ${seconds} seconds`;
    historyList.appendChild(listItem);
}

function updateThemeToggleBtnText() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const currentTheme = document.body.classList.contains('theme-dark') ? 'Dark' : 'Light';
    themeToggleBtn.textContent = `Toggle Theme (${currentTheme})`;
}

updateThemeToggleBtnText();

function toggleTheme() {
    const isDarkMode = document.body.classList.contains('theme-dark');
    const newTheme = isDarkMode ? 'theme-light' : 'theme-dark';

    document.body.classList.replace(isDarkMode ? 'theme-dark' : 'theme-light', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleBtnText();
    
    
    applyColorThemes(isDarkMode);
}

function applyColorThemes(isDarkMode) {
    const body = document.body;
    const header = document.querySelector('header');
    const timerContainer = document.querySelector('.timer-container');
    const button = document.getElementById('themeToggleBtn');
    const footer = document.querySelector('footer');

    if (isDarkMode) {
        
        body.style.background = 'linear-gradient(45deg, #2c3e50, #34495e)';
        header.style.backgroundColor = '#3a1a4d';
        timerContainer.style.backgroundColor = 'rgba(138, 109, 182, 0.8)';
        button.style.backgroundColor = '#39b54a';
        footer.style.backgroundColor = '#6373cf';
    } else {
       
        body.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
        header.style.backgroundColor = '#e74c3c';
        timerContainer.style.backgroundColor = 'rgba(223, 230, 233, 0.8)';
        button.style.backgroundColor = '#39b54a';
        footer.style.backgroundColor = '#3498db';
    }
}
