let taskForm = document.querySelector('#task-form');
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let taskInput = document.querySelector('#input-item');
    let task = taskInput.value.trim();

    let hoursInput = document.querySelector('#input-hours');
    let minutesInput = document.querySelector('#input-minutes');

    let hours = parseInt(hoursInput.value);
    let minutes = parseInt(minutesInput.value);

    if (isNaN(hours)) {
        hours = 0;
    }

    if (isNaN(minutes)) {
        minutes = 0;
    }

    let timerDuration = (hours * 60) + minutes; // Convert hours to minutes and add minutes

    let taskList = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    taskList.unshift({ task, timer: timerDuration, timerDisplay: '' }); // Store timerDuration
    localStorage.setItem('tasks', JSON.stringify(taskList));

    displayTask();
});


// Modify the displayTask function
let displayTask = () => {
    let taskListUl = document.querySelector('#task-list');
    let taskList = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    if (taskList.length !== 0) {
        let eachTask = '';
        for (let taskObj of taskList) {
            let task = taskObj.task;
            let timerDuration = taskObj.timer;
            let timerDisplay = taskObj.timerDisplay;

            let deleteButton = `<button class="delete-task">Delete Task</button>`;
            let countdownButton = '';
            
            // Check if timer is set for the task
            if (timerDuration > 0) {
                countdownButton = `<button class="countdown-timer" data-timer="${timerDuration}">Countdown</button>`;
            }
            
            eachTask += `
                <li>
                    <span id="task-span">${task}</span>
                    ${countdownButton}
                    ${deleteButton}
                    <span class="countdown-display"></span>
                </li>`;

            // Start the timer for this task
            if (timerDuration > 0) {
                setTimeout(() => {
                    if (confirm(`Timer for task "${task}" has elapsed. Mark as completed?`)) {
                        taskObj.timer = 0; // Set timer to 0 to mark as completed
                        localStorage.setItem('tasks', JSON.stringify(taskList));
                        displayTask();
                    }
                }, timerDuration * 60 * 1000); // Convert minutes to milliseconds
            }
        }
        taskListUl.innerHTML = eachTask;
    }
};

// delete task
let deleteTask = document.querySelector('#task-list');
deleteTask.addEventListener('click', (event) => {
    let targetElement = event.target;

    if (targetElement.classList.contains('delete-task')) {
        let actualEl = targetElement.parentElement;
        let selectedTask = actualEl.querySelector('#task-span').innerText.trim();

        // Retrieve tasks from local storage
        let taskList = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

        // Find the index of the selected task
        let taskIndex = taskList.findIndex((taskObj) => taskObj.task.trim() === selectedTask);

        if (taskIndex !== -1) {
            // Remove the task from the array
            taskList.splice(taskIndex, 1);

            // Update local storage
            localStorage.setItem('tasks', JSON.stringify(taskList));

        }
    }
});
displayTask();

//event listener for countdown timer
let countdownButtons = document.querySelectorAll('.countdown-timer');
countdownButtons.forEach(button => {
    button.addEventListener('click', () => {
        let timerDuration = parseInt(button.getAttribute('data-timer'));
        if (!isNaN(timerDuration) && timerDuration > 0) {
            let countdownDisplay = button.parentElement.querySelector('.countdown-display');
            startCountdown(timerDuration, countdownDisplay);

            // Replace the "Countdown" button with the countdown display
            button.style.display = 'none'; // Hide the button
            countdownDisplay.style.display = 'inline'; // Display the countdown display
        }
    });
});


function startCountdown(duration, displayElement) {
    let timer = duration * 60; // Convert minutes to seconds
    let minutes, seconds;

    let countdownInterval = setInterval(function () {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        displayElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timer--;

        if (timer < 0) {
            clearInterval(countdownInterval);
            displayElement.textContent = 'Time elapsed';
        }
    }, 1000);
}





