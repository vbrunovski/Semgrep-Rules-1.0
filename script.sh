#!/bin/sh

# 1. Устанавливаем semgrep во временное окружение Jenkins
python3 -m pip install --user semgrep

# 2. Добавляем путь к установленной утилите
export PATH="$HOME/.local/bin:$PATH"

# 3. Запускаем сканирование файла в текущей рабочей директории Jenkins
semgrep scan --config my-rule-explanations-2.yaml server1.js