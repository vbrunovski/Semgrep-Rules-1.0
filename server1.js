const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());



// Хранилище настроек пользователей
const userConfigs = {};

// Вспомогательная функция для глубокого объединения объектов
function merge(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
            //console.log(1);
        } else {
            target[key] = source[key];
            //console.log(2);
        }
    }
    return target;
}



/*

// 1. БЕЗОПАСНАЯ функция merge (Защита от Prototype Pollution)
function merge(target, source) {
    for (let key in source) {
        // БЛОКИРОВКА: Запрещаем ключи, ведущие к прототипу
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue; // Пропускаем опасный ключ
        }

        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

*/


// 1. Эндпоинт обновления профиля и настроек
app.post('/api/profile/update', (req, res) => {
    const userId = req.body.userId;
    const newSettings = req.body.settings;

    if (!userConfigs[userId]) {
        userConfigs[userId] = {};
    }

    // Применяем новые настройки пользователя
    merge(userConfigs[userId], newSettings);


    //check
    const brandNewEmptyObject = {}; //Create empty object
    console.log('Empty object', brandNewEmptyObject.isAdmin);
    console.log('Empty object', brandNewEmptyObject.pwned);
    console.log('True or False property', brandNewEmptyObject.hasOwnProperty('isAdmin'));
    console.log("Empty object", brandNewEmptyObject.yo);
    res.json({ status: 'success', config: userConfigs[userId] });
});

// 2. Эндпоинт экспорта отчета пользователя в системную папку
app.post('/api/export/report', (req, res) => {
    const { filename, userId } = req.body;

    // Генерируем команду для создания архивного файла
    const command = `tar -czf /var/reports/${userId}_${filename}.tar.gz /data/${userId}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Export failed' });
        }
        res.json({ status: 'Report generated', path: `/reports/${filename}` });
    });
});

// 3. Клиентская функция отображения статуса профиля (Frontend JS)
function renderUserProfile(userData) {
    const statusContainer = document.getElementById('user-status');
    
    // Получаем статус из URL параметром ?status=... или из данных
    const urlParams = new URLSearchParams(window.location.search);
    const customStatus = urlParams.get('status') || userData.status;

    // Выводим статус на страницу
    statusContainer.innerHTML = `<div class="profile-badge">User Status: ${customStatus}</div>`;
}

app.listen(3333, () => console.log('Server running on port 3333'));