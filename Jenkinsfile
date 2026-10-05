pipeline {
    agent any
    
    stages {
        stage('Semgrep Scan') {
            steps {
                script {
                    sh 'docker run --rm -v "${WORKSPACE}":/src -w /src returntocorp/semgrep semgrep scan --config /src/my-rule-explanations-2.yaml /src/server1.js'
                }
            }
        }
    }
}