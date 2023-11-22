import pandas as pd

def export_tabledata():
    filepath = '../../src/assets/data/Malaria and GDP Data 2010-2017 with GDP per Capita.csv'
    
    df = pd.read_csv(filepath, delimiter=',', encoding='utf-8')
    
    df['GDP_per_capita'] = df['GDP_per_capita'].astype(int)

    df = df[['Country', 'Year', 'No. of cases_median', 'No. of deaths_median', 'GDP_per_capita']] 

    df = df.rename(columns={'Country': 'country',
                            'Year': 'year',
                            'No. of cases_median': 'malaria case count',
                            'No. of deaths_median': 'malaria death count',
                            'GDP_per_capita': 'gdp per capita'})
    
    df.to_json('../../src/assets/data/tabledata.json', orient='records')

if __name__ == '__main__':
    export_tabledata()
