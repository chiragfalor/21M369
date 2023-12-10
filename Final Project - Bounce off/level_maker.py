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
scale = [0, 2, 4, 5, 7, 9, 11, 12]
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
    level3.add_obstacle(Square(False, 55, 100, 100, 50, ))
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
    C_scale = [60+s for s in scale] # C major scale
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
    A_scale = [69+s for s in scale] # A major scale
    for i in range(8):
        level7.add_obstacle(Rectangle(False, A_scale[i], xc=x1 if i%2 == 0 else x2, yc=200+(i) * 60, width=width, height=height))

    return level7

def ode_to_joy():
    level8 = Level("ode_to_joy", bouncer_size=15)
    # main chorus
    chorus = [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1]
    extra = [2, 1, 0, 0]
    key = 69

    left_x = 250
    right_x = 550
    height = 80
    width = 200
    init_y = 50
    for i in range(len(chorus)):
        level8.add_obstacle(Rectangle(False, key + scale[chorus[i]], 
                                      xc=left_x if i%2 == 0 else right_x, 
                                      yc=init_y+(i) * (height // 2 + 10), 
                                      width=width, height=height))
    # add vertical rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[0]], 
                                  xc=right_x - 50, 
                                  yc=init_y + len(chorus) * (height // 2 + 10) + 50,
                                  width=80, height=200))
    # add horizontal rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[1]], 
                                  xc=left_x,
                                  yc=init_y + len(chorus) * (height // 2 + 10)+ 60,
                                  width=width, height=height))
    # add vertical rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[2]], 
                                  xc=right_x + 50, 
                                  yc=init_y + len(chorus) * (height // 2 + 10)+ 50,
                                  width=80, height=200))
    # add horizontal rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[3]], 
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
    A_scale = [69+s for s in scale] # A major scale
    mp = MusicalPhrase("test", A_scale, [1]*len(A_scale))
    lvl = make_musical_level(mp)
    lvl.bouncer_size = 10
    return lvl





if __name__ == "__main__":
    generator = GameLevelGenerator()

    # generator.add_level(create_basic_level())
    # generator.add_level(two_rectangles())
    # generator.add_level(disc_and_sphere())
    # generator.add_level(four_rectangles())
    # generator.add_level(multiple_vertical_bounces())
    # generator.add_level(wall_in_between())
    # generator.add_level(multiple_horizontal_bounces())
    # generator.add_level(ode_to_joy())
    # generator.add_level(create_four_triangles())

    
    generator.add_level(basic_musical_level())


    # Save to JSON in the current directory
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    generator.save_to_json(os.path.join(cur_dir, "levels.json"))
