import pandas as pd

def export_tabledata():
    filepath = '../data/Malaria and GDP Data 2010-2017 with GDP per Capita.csv'
    
    df = pd.read_csv(filepath, delimiter=',', encoding='utf-8')

    df = df[['Country', 'Year', 'No. of cases_median', 'No. of deaths_median', 'GDP_per_capita']] 

    df = df.rename(columns={'No. of cases_median': 'Malaria Case Count',
                            'No. of deaths_median': 'Malaria Death Count',
                            'GDP_per_capita': 'GDP per Capita'})
    
    df.to_json('../data/tabledata.json', orient='records')

if __name__ == '__main__':
    export_tabledata()
