pipeline {
    agent any
    
    stages {
        stage('Semgrep Rules Scan') {
            steps {
                script {
                    sh '''
                        tar -cf - server1.js my-rule-explanations-2.yaml | docker run --rm -i returntocorp/semgrep sh -c "
                            mkdir -p /src && \\
                            tar -xf - -C /src && \\
                            semgrep scan --config /src/my-rule-explanations-2.yaml /src/server1.js
                        "
                    '''
                }
            }
        }
    }
}