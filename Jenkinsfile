pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Workspace') {
            steps {
                sh "ls -la"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t cicd-project:v1 .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker rm -f cicd-project || exit 0'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}