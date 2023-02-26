FROM node:16.14.0

WORKDIR /app

# COPY package.json .
# RUN npm install

COPY *.mjs ./
COPY *.ts ./
COPY *.json ./

COPY Components ./Components
COPY pages ./pages
COPY public ./public
COPY Store ./Store
COPY Styles ./Styles
COPY Types ./Types

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]