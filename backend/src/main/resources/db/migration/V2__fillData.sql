INSERT INTO course (id, name)
VALUES
    (1, 'Jedi Training'),
    (2, 'Piloting 101'),
    (3, 'Lightsaber Combat'),
    (4, 'Force Mastery'),
    (5, 'Galactic Diplomacy'),
    (6, 'Tactical Warfare'),
    (7, 'Sith Arts'),
    (8, 'Starship Engineering');

INSERT INTO student (id, firstname, lastname, email)
VALUES
    (1, 'Luke', 'Skywalker', 'luke@jedi.com'),
    (2, 'Leia', 'Organa', 'leia@rebel.com'),
    (3, 'Han', 'Solo', 'han@smuggler.com'),
    (4, 'Yoda', 'Yolo', 'yoda@jedi.com'),
    (5, 'Rey', 'Palpatine', 'rey@scavenger.com');

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
