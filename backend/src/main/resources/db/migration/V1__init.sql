CREATE TABLE student (
    id BIGSERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE course (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE student_course (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id)
);

INSERT INTO course (name)
VALUES
    ('Jedi Training'),
    ('Piloting 101'),
    ('Lightsaber Combat'),
    ('Force Mastery'),
    ('Galactic Diplomacy'),
    ('Tactical Warfare'),
    ('Sith Arts'),
    ('Starship Engineering');

INSERT INTO student (firstname, lastname, email)
VALUES
    ('Luke', 'Skywalker', 'luke@jedi.com'),
    ('Leia', 'Organa', 'leia@rebel.com'),
    ('Han', 'Solo', 'han@smuggler.com'),
    ('Yoda', 'Yolo', 'yoda@jedi.com'),
    ('Rey', 'Palpatine', 'rey@scavenger.com');

INSERT INTO student_course (student_id, course_id)
VALUES
    -- Luke Skywalker
    (1, 1), -- Jedi Training
    (1, 2), -- Piloting 101
    (1, 3), -- Lightsaber Combat

    -- Leia Organa
    (2, 4), -- Force Mastery
    (2, 5), -- Galactic Diplomacy

    -- Han Solo
    (3, 2), -- Piloting 101
    (3, 6), -- Tactical Warfare

    -- Yoda
    (4, 4), -- Force Mastery
    (4, 3), -- Lightsaber Combat
    (4, 7), -- Sith Arts

    -- Rey
    (5, 1), -- Jedi Training
    (5, 3); -- Lightsaber Combat
