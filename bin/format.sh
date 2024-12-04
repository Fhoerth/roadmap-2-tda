./bin/install.sh && \
cd ./applications/backend && ./format.sh && cd ../.. && \
cd ./applications/frontend && ./format.sh && cd ../.. && \
cd ./applications/leetcode-service && ./format.sh && cd ../.. && \
xmllint --format applications/backend/pom.xml -o applications/backend/pom.xml