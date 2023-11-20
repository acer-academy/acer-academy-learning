# AcerTech Learning Management System

<a alt="React logo" href="" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png" width="50"></a>
<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="50"></a>
<a alt="Postgres logo" href="" target="_blank" rel="noreferrer"><img src="https://cdn.iconscout.com/icon/free/png-256/free-postgresql-11-1175122.png" width="50"></a>

Acer Academy is on a rapid expansion trajectory, seeking to enhance its existing operational procedures while venturing into the development of an online learning platform. The primary goal of AcerTech is to reduce inefficiencies, streamline processes, and ensure preparedness for unexpected disruptions, such as the challenges posed by the COVID-19 pandemic. AcerTech is designed to complement Acer Academy's traditional in-person instructional sessions, aiming to advance and augment students' educational experiences.

*Note: This project was created for IS4103 Information Systems Capstone Project, in collaboration with a tuition centre chain.*

✨ Visit our [project website](https://uvents.nus.edu.sg/event/23rd-steps/module/IS4103/project/14)! ✨

## System Overview

AcerTech consists of three distinct front-end systems tailored to cater to the specific needs of different stakeholders:

### Teacher Course Management System

The Teacher Course Management System is designed to empower Acer Academy's educators. This system provides teachers with a comprehensive suite of functionality to efficiently administer courses, engage with students, and track student academic progress. Teachers can seamlessly manage course content, assignments, quizzes, schedule classes, and interact with students to create a dynamic and engaging learning environment beyond regular lesson times.

### Student Learning System

The Student Learning System is focused on enhancing the academic experience for Acer Academy's students and their parents. This system enables students to navigate their online learning with ease, allowing them to monitor their academic progress and access vital learning resources, including assignments and quizzes. Additionally, it simplifies class booking and provides secure transaction capabilities for the purchase of class packages.

### Admin Management System

Acer Academy's administrators play a pivotal role in overseeing the institution's operations. The Admin Management System equips them with the necessary tools for efficient management, covering tasks such as center and employee/student profile management, transaction oversight, and promotional activities.

## Tech Stack

- **Frontend Framework:** React and Next.js
- **Backend Framework:** Express
- **Database:** PostgreSQL
- **ORM (Object-Relational Mapping):** Prisma

## How to locally deploy our system

1. **Create a PostgreSQL database locally:**

2. **Create a `.env` file in the root folder that contains:**
    ```env
    DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[databaseName]"
    PORT=8000
    ```
    - Replace `[username]`, `[password]`, and `[databaseName]` with your PostgreSQL credentials.
    - If your PostgreSQL port number is not the default `5432`, please update the database URL accordingly.

3. **Make a copy of that `.env` file, and put it in `apps/backend`:**
    - *[Optional: For integration with Stripe and Whatsapp Business sandbox environments]*
   To the `apps/backend/.env` file, add:
    ```env
    STRIPE_API_KEY=[your stripe API key]
    STRIPE_ENDPOINT_SIGNING_SECRET=[your stripe endpoint signing secret]

    WHATSAPP_TOKEN=[your whatsapp token]
    MY_PHONE_NUMBER=[your target phone number]
    WHATSAPP_TEST_PHONE_NUMBER_ID=[your whatsapp test phone number ID]
    ```
    - The paths of the two `.env` files should be `.env` and `apps/backend/.env`

5. **In the root folder, run:**
    ```bash
    yarn
    npx prisma migrate dev
    ```

6. **To start the system, run:**
    ```bash
    nx run-many --target=serve --all --maxParallel=100
    ```

7. **Preload accounts + sample questions and quizzes into the question bank by running:**
    ```bash
    node apps/backend/src/utils/quizQuestionsGenerator.js
    ```
    in the terminal

8. **To access the 3 different systems:**
    - Admin: [http://localhost:3001/](http://localhost:3001/)
    - Student: [http://localhost:3000/](http://localhost:3000/)
    - Teacher: [http://localhost:3002/](http://localhost:3002/)

8. **Login to Admin system using superadmin:**
    - Email: su@su.com
    - Password: password

9. **Note:**
    - If you want to test Reset Password, you have to use a real Gmail account when signing up.
