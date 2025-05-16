import csv

def parse_csv(file_path):
    users = []
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            user = {
                "email": row["email"],
                "name": row["name"],
                "tags": row["tags"].split(","),
                "links": row["links"].split(","),
                "active": True
            }
            users.append(user)
    return users
