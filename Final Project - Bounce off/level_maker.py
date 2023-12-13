import os
from Level import *

from musical_levels import make_musical_level, MusicalPhrase

# notes to midi:
note_to_midi = {
    "C": 60,
    "C#": 61,
    "D": 62,
    "D#": 63,
    "E": 64,
    "F": 65,
    "F#": 66,
    "G": 67,
    "G#": 68,
    "A": 69,
    "A#": 70,
    "B": 71
}
major_scale = [-1, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16]
minor_scale = [-1, 0, 2, 3, 5, 7, 8, 10, 12]
pentatonic_scale = [0, 2, 4, 7, 9, 12]
chord = [0, 4, 7, 12]


def create_basic_level():
    level1 = Level("one_disc")
    # level1.add_obstacle(Square(100, 100, 50, False, 55))
    level1.add_obstacle(Disc(False, 60, 600, 400, 100,))
    level1.add_obstacle(Rectangle(True, 0, 50, 300, 400, 50))
    
    level1.add_obstacle(Rectangle(True, 0, 50, 500, 400, 50))
    return level1

def two_rectangles():
    level2 = Level("two_rectangles")
    level2.add_obstacle(Rectangle(False, 60, 200, 100, 50, 500))
    level2.add_obstacle(Rectangle(False, 72, 600, 100, 50, 500, ))
    return level2

def disc_and_sphere():
    level3 = Level("disc_and_sphere")
    level3.add_obstacle(Disc(False, 60, 400, 400, 100, ))
    level3.add_obstacle(Rectangle(False, 55, 100, 100, 50, 50, ))
    return level3

def four_rectangles():
    level4 = Level("four_rectangles")
    level4.add_obstacle(Rectangle(False, 60, xc=400, yc=200, width=300, height=50))
    level4.add_obstacle(Rectangle(False, 64, xc=200, yc=400, width=50, height=300))
    level4.add_obstacle(Rectangle(False, 67, xc=400, yc=600, width=300, height=50))
    level4.add_obstacle(Rectangle(False, 72, xc=600, yc=400, width=50, height=300))
    return level4

def multiple_vertical_bounces():
    height = 20
    width = 500
    xc = 400
    level5 = Level("multiple_vertical_bounces")
    C_scale = [60+s for s in major_scale[1:]] # C major scale
    for i in range(8):
        level5.add_obstacle(Rectangle(False, C_scale[i], xc=xc, yc=-1*(-1)**(i%2)* (i+4)//2 * 50 + 400, width=width, height=height))

    return level5

def wall_in_between():
    level6 = Level("wall_in_between")
    level6.add_obstacle(Rectangle(False, 60, xc=200, yc=200, width=100, height=100))
    level6.add_obstacle(Rectangle(False, 72, xc=600, yc=200, width=100, height=100))

    # add wall
    level6.add_obstacle(Rectangle(True, 0, xc=400, yc=200, width=50, height=300))
    # add bouncer at top
    level6.add_obstacle(Rectangle(True, 0, xc=400, yc=600, width=300, height=50))

    return level6

def multiple_horizontal_bounces():
    height = 100
    width = 50
    x1 = 200
    x2 = 600
    level7 = Level("multiple_horizontal_bounces")
    A_scale = [69+s for s in major_scale[1:]] # A major scale
    for i in range(8):
        level7.add_obstacle(Rectangle(False, A_scale[i], xc=x1 if i%2 == 0 else x2, yc=200+(i) * 60, width=width, height=height))

    return level7

def ode_to_joy():
    level8 = Level("ode_to_joy", bouncer_size=15)
    # main chorus
    chorus = [3, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2]
    extra = [3, 2, 1, 1]
    key = 69

    left_x = 250
    right_x = 550
    height = 80
    width = 200
    init_y = 50
    for i in range(len(chorus)):
        level8.add_obstacle(Rectangle(False, key + major_scale[chorus[i]], 
                                      xc=left_x if i%2 == 0 else right_x, 
                                      yc=init_y+(i) * (height // 2 + 10), 
                                      width=width, height=height))
    # add vertical rectangle
    level8.add_obstacle(Rectangle(False, key + major_scale[extra[0]], 
                                  xc=right_x - 50, 
                                  yc=init_y + len(chorus) * (height // 2 + 10) + 50,
                                  width=80, height=200))
    # add horizontal rectangle
    level8.add_obstacle(Rectangle(False, key + major_scale[extra[1]], 
                                  xc=left_x,
                                  yc=init_y + len(chorus) * (height // 2 + 10)+ 60,
                                  width=width, height=height))
    # add vertical rectangle
    level8.add_obstacle(Rectangle(False, key + major_scale[extra[2]], 
                                  xc=right_x + 50, 
                                  yc=init_y + len(chorus) * (height // 2 + 10)+ 50,
                                  width=80, height=200))
    # add horizontal rectangle
    level8.add_obstacle(Rectangle(False, key + major_scale[extra[3]], 
                                  xc=right_x,
                                  yc=init_y + len(chorus) * (height // 2 + 10) + 190,
                                  width=width, height=20))
    return level8

def create_four_triangles():
    level9 = Level("four_triangles", bouncer_size=10)
    level9.add_obstacle(RightTriangle(False, 60, 600, 200, 100, 135))
    level9.add_obstacle(RightTriangle(False, 64, 200, 200, 100, 45))
    level9.add_obstacle(RightTriangle(False, 67, 200, 600, 100, -45))    
    level9.add_obstacle(RightTriangle(False, 72, 600, 600, 100, -135))
    return level9

def basic_musical_level():
    # A_scale = [69+s for s in scale] # A major scale
    mp = MusicalPhrase("test", major_scale[1:], [1]*len(major_scale[1:]), tempo=100, root_key=69)
    lvl = make_musical_level(mp, start_pos = (-50, 200), scale=150)
    lvl.bouncer_size = 10
    return lvl

def twinkle_twinkle():
    twinkle_notes = [1,1, 5,5, 6,6, 5, 4,4, 3,3, 2,2, 1]
    twinkle_durations = [1,1, 1,1, 1,1, 2, 1,1, 1,1, 1,1, 2]
    dir_prefs = [0,0, 0,0, 1,0, 1, 1,1, 1,0, 1,0, 0]
    notes = [major_scale[note] for note in twinkle_notes]
    mp = MusicalPhrase("twinkle_twinkle", notes, twinkle_durations, tempo=100, root_key=69)
    lvl = make_musical_level(mp, direction_preferences=dir_prefs, scale=100, start_pos=[50, 350])
    lvl.bouncer_size = 10
    return lvl



def composition_cfalor_051():
    pass

def washing_machine_compostion():
    melody = [5, 8,7,6, 5, 3, 4,5,6, 2,3,4, 3, 5, 5, 8,7,6, 5, 8, 8,9,8, 7,6,7, 8]
    durations = [3, 1,1,1, 3, 3, 1,1,1, 1,1,1, 3, 3, 3, 1,1,1, 3, 3, 1,1,1, 1,1,1, 3]
    dir_prefs = [0, 0,1,0, 0, 0, 1,0,0, 0,1,0, 1, 0, 0, 1,0,0, 0, 1, 1,1,0, 1,0,0, 0]
    notes = [major_scale[note] for note in melody]
    mp = MusicalPhrase("washhing_maching", notes, durations, tempo=100, root_key=65)
    lvl = make_musical_level(mp, direction_preferences=dir_prefs, scale=50)
    lvl.bouncer_size = 10
    return lvl


def christmas_song():
    melody = [3,3, 3, 3,3, 3, 3,5,1, 2,3, 4,4,4, 4,4, 3,3, 3,3, 5,5,4,2,1]
    rhythm = [1,1, 2, 1,1, 2, 1,1,2.5, 0.5,4, 1,1,1.5, 0.5,1, 1,1, 0.5,0.5, 1,1,1,1,4]
    # dir_prefs = [1,0, 1, 1,1, 0, 1,1,1, 0,0, 0,0,0, 1,1, 1,0, 0,0, 0,0,0,0,0]
    dir_prefs = [1,0, 1, 0,0, 0, 1,1,0, 0,1, 0,1,0, 1,1, 1,1, 1,0, 1,1,0,1,1]
    notes = [major_scale[note] for note in melody]
    mp = MusicalPhrase("christmas_song", notes, rhythm, tempo=60, root_key=63)
    lvl = make_musical_level(mp, direction_preferences=dir_prefs, scale=50, start_pos=[50, 750])
    lvl.bouncer_size = 10
    return lvl


def rick_roll():
    major_scale = [-1, 0, 2, 4, 5, 7, 9, 11, 12, -12, -10, -8, -7, -5, -3]
    melody1 = [1,   2,  -2, 2,    3,   5,4,3,          1,   2, -2,   ]   
    rhythm1 = [1.5, 1.5, 1, 1.5, 1.5,  0.25,0.25,0.5,   1.5, 1.5, 2, ]
    dir_prefs1 = [0,   0,   0, 1,    0,   1, 0,1,          1,   0, 0,      ]
    melody2 = [-2,-1,1,-1,            3, 3, 2,       -2,-1,1,-1,     1,   2,0,-1,-2,-2,     2,1]
    rhythm2 = [0.25,0.25,0.25,0.25, 1.5,1.5,1.5, 0.25,0.25,0.25,1.0, 1, 0.5,0.75,0.25,1.1,0.5, 1,4]
    dir_prefs2 = [1,0,1,0,             0, 1, 0,       1,0,1,0,        1,   1,1,1,0,1,      1,0]
    melody = melody1 + melody2
    rhythm = rhythm1 + rhythm2
    dir_prefs = dir_prefs1 + dir_prefs2
    notes = [major_scale[note] for note in melody]
    mp = MusicalPhrase("rick_roll", notes, rhythm, tempo=60, root_key=65)
    lvl = make_musical_level(mp, direction_preferences=dir_prefs, scale=75, start_pos=[00, 50])
    lvl.bouncer_size = 5
    return lvl
    # pass



# add rick roll





if __name__ == "__main__":
    generator = GameLevelGenerator()

    generator.add_level(create_basic_level())
    generator.add_level(two_rectangles())
    generator.add_level(disc_and_sphere())
    generator.add_level(four_rectangles())
    generator.add_level(multiple_vertical_bounces())
    generator.add_level(wall_in_between())
    generator.add_level(multiple_horizontal_bounces())
    generator.add_level(ode_to_joy())
    generator.add_level(create_four_triangles())

    
    # generator.add_level(basic_musical_level())
    generator.add_level(twinkle_twinkle())
    generator.add_level(washing_machine_compostion())
    generator.add_level(christmas_song())
    generator.add_level(rick_roll())


    # Save to JSON in the current directory
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    generator.save_to_json(os.path.join(cur_dir, "levels.json"))
