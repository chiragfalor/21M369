
from Level import *
import numpy as np

class MusicalPhrase:
    def __init__(self, phrase_name, notes, durations, tempo=100):
        '''
        notes: list of midi integers representing notes
        durations: list of floats representing durations
        tempo: integer representing beats per minute
        '''

        self.name = phrase_name

        assert len(notes) == len(durations)
        self.notes = notes
        self.durations = durations
        self.tempo = tempo

        self.notes_with_prev_durations = [(notes[i+1], durations[i]) for i in range(len(notes)-1)]
        self.notes_with_prev_durations.insert(0, (notes[0], 1))


def make_musical_level(phrase: MusicalPhrase):
    '''
    phrase: MusicalPhrase object
    '''
    level = Level(phrase.name)

    # we will add in right triangles so that the bouncer bounces creating the notes in the phrase

    # start from (0, 0) top left corner and have triangles go down and to the right

    scale = 2e4 / phrase.tempo

    def get_new_ball_direction(incoming_direction, cur_coord, obstacles_coords):
        dir_1 = incoming_direction + np.pi / 2
        dir_2 = incoming_direction - np.pi / 2
        # see which direction is more open, count the number of obstacles in each direction
        def side_of_line(point, line_start, line_end):
            return np.sign(np.cross(line_end - line_start, point - line_start))
        
        def count_obstacles_in_direction(direction):
            count = 0
            for obstacle_coord in obstacles_coords:
                if side_of_line(obstacle_coord, cur_coord, cur_coord + np.array([np.cos(direction), np.sin(direction)])) > 0:
                    count += 1
           
            return count
        
        def wall_preference(dir1, dir2):
             # also check if this direction is closer to wall, box is (0,0) to (800, 800)
             # extend both directions to the wall and see which one is closer

            dir1_wall_dist = min(cur_coord[0] / np.cos(dir1), cur_coord[1] / np.sin(dir1), (800 - cur_coord[0]) / np.cos(dir1), (800 - cur_coord[1]) / np.sin(dir1))
            dir2_wall_dist = min(cur_coord[0] / np.cos(dir2), cur_coord[1] / np.sin(dir2), (800 - cur_coord[0]) / np.cos(dir2), (800 - cur_coord[1]) / np.sin(dir2))

            return 2*(dir1_wall_dist < dir2_wall_dist) - 1


        
        if count_obstacles_in_direction(dir_1) + 5*wall_preference(dir_1, dir_2) < count_obstacles_in_direction(dir_2):
            return dir_1
        else:
            return dir_2
        
    def get_obstacle_direction(incoming_direction, outgoing_direction):
        incoming_v = np.array([np.cos(incoming_direction), np.sin(incoming_direction)])
        outgoing_v = np.array([np.cos(outgoing_direction), np.sin(outgoing_direction)])
        normal_v = -incoming_v + outgoing_v
        return np.arctan2(normal_v[1], normal_v[0])
        
    cur_pos = np.array([0, scale//4])
    cur_dir = 0
    obstacle_coords = []

    for note, duration in phrase.notes_with_prev_durations:
        # add a triangle
        print(cur_pos)
        obstacle_coords.append(cur_pos)
        cur_pos = cur_pos + scale * duration * np.array([np.cos(cur_dir), np.sin(cur_dir)])
        new_dir = get_new_ball_direction(cur_dir, cur_pos, obstacle_coords)
        obstacle_direction = get_obstacle_direction(cur_dir, new_dir)

        level.add_obstacle(RightTriangle(False, note, cur_pos[0], cur_pos[1], 100, obstacle_direction / np.pi * 180))
        cur_dir = new_dir

    return level


if __name__=="__main__":
    mp = MusicalPhrase("test", [60, 62, 64, 65, 67, 69, 71, 72], [1, 1, 1, 1, 1, 1, 1, 1])
    level = make_musical_level(mp)
    print(level.to_dict())
