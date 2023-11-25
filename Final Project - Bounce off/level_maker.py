import json

class Square:
    def __init__(self, x, y, size, is_collidable):
        self.x = x
        self.y = y
        self.size = size
        self.is_collidable = is_collidable

    def to_dict(self):
        return {"x": self.x, "y": self.y, "size": self.size, "isCollidable": self.is_collidable}

class Disc:
    def __init__(self, x, y, radius, is_collidable):
        self.x = x
        self.y = y
        self.radius = radius
        self.is_collidable = is_collidable

    def to_dict(self):
        return {"x": self.x, "y": self.y, "radius": self.radius, "isCollidable": self.is_collidable}

class Level:
    def __init__(self, name):
        self.name = name
        self.squares = []
        self.discs = []

    def add_square(self, x, y, size, is_collidable):
        self.squares.append(Square(x, y, size, is_collidable))

    def add_disc(self, x, y, radius, is_collidable):
        self.discs.append(Disc(x, y, radius, is_collidable))

    def to_dict(self):
        return {
            "name": self.name,
            "squares": [square.to_dict() for square in self.squares],
            "discs": [disc.to_dict() for disc in self.discs]
        }

class GameLevelGenerator:
    def __init__(self):
        self.levels = []

    def add_level(self, level):
        self.levels.append(level)

    def save_to_json(self, file_name):
        with open(file_name, 'w') as file:
            json.dump([level.to_dict() for level in self.levels], file, indent=4)


def create_basic_level():
    level1 = Level("level1")
    # level1.add_square(100, 100, 10, True)
    level1.add_disc(250, 250, 50, False)
    return level1


if __name__=="__main__":
    # Example usage
    generator = GameLevelGenerator()

    generator.add_level(create_basic_level())



    import os
    # get cur dir
    cur_dir = os.path.dirname(__file__)
    generator.save_to_json(os.path.join(cur_dir, "levels.json"))
