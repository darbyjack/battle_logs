// Load CSV files, or specifically the ones exported by STFC

import JSZip from 'jszip'

class BattleLog {
    // so STFC technically exports TSV files rather than CSV, apparently
    delimiter = "\t";
    // windows-like line-endings
    line_ending = "\r\n";
    // file contains multiple tables
    tables = [];
    location = "";
    timestamp = "";
    constructor(tables = []) {
        this.tables = tables;
        if (this.tables.length > 0) {
            this.location = this.tables[0][0]["Location"];
            this.timestamp = this.tables[0][0]["Timestamp"];
            this.compress();
        }
    }
    from_text(raw_data) {
        // tables are separated by an empty line
        const tables = raw_data.split(`${this.line_ending}${this.line_ending}`);
        for (const table of tables) {
            let rows = table.split(this.line_ending);
            const header = rows.shift().split(this.delimiter);
            let parsed_table = [];
            // skip tables that have no rows
            if (rows.length < 1) continue;
            for (const row of rows) {
                let parsed_row = {};
                const items = row.split(this.delimiter);
                for (const item in items) {
                    parsed_row[header[item]] = items[item];
                }
                parsed_table.push(parsed_row);
            }
            this.tables.push(parsed_table);
        }
        this.location  = this.tables[0][0]["Location"];
        this.timestamp = this.tables[0][0]["Timestamp"];
    }
    from_file(file) {
        let promise = new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = () => {
                this.from_text(fileReader.result);
                resolve(this);
            };
            fileReader.onerror = () => {
                reject(fileReader.error);
            };
        });
        return promise;
    }
    compress() {
        const zip = new JSZip();

        zip.file("report.csv", JSON.stringify(this.get_stats()));
                
        zip.generateAsync({type:"base64", compression: "DEFLATE"}).then(function(content) {
            // see FileSaver.js
            // saveAs(content, "example.zip");
            console.log(content);
        });        
    }
    get_summary_table() {
        // let combat = this.tables.length - 1;
        // let stats_per_person = {};
        // for(let row of this.tables[combat]) {

        // }
        let stats = this.get_stats();
        let summary_table = {
            rows: [],
            rows_received: [],
            headers: stats.attackers
        };

        let rows = {
            "total": "Total Damage",
            "critical": "Critical Damage", 
            "critical_pct": "Critical %",           
            "unmitigated": "Unmitigated Damage",
            "hull": "Hull Damage",
        };
        let rows_received = {
            "total_recv": "Total Damage",
            "mitigated": "Mitigated Damage",
            "mitigated_pct": "Mitigated %",           
            "hull_recv": "Hull Damage",
        };

        let number_rows = [
            "total", "unmitigated", "mitigated", "total_recv", "hull_recv", "hull", "critical"
        ];
        for (let row in rows) {
            let row_data = [ rows[row] ];
            for(let person of stats.attackers) {
                if(number_rows.includes(row)) {
                    row_data.push(parseInt(stats.per_person[person][row]).toLocaleString("en-uS"));
                } else {
                    row_data.push(stats.per_person[person][row]);
                }
            }
            summary_table.rows.push(row_data); 
        }
        for (let row in rows_received) {
            let row_data = [ rows_received[row] ];
            for(let person of stats.attackers) {
                if(number_rows.includes(row)) {
                    row_data.push(parseInt(stats.per_person[person][row]).toLocaleString("en-uS"));
                } else {
                    row_data.push(stats.per_person[person][row]);
                }
            }
            summary_table.rows_received.push(row_data); 
        }
        
        return summary_table;
    }
    get_stats() {
        let attackers = [];
        let stats_per_person = {};
        let stats_per_person_per_round = [];
        let combat = this.tables.length - 1;
        for (let row of this.tables[combat]) {
          if (row["Type"] === "Attack") {
            let attacker_name = row["Attacker Name"];
            let target_name = row["Target Name"];
            let total_damage = parseInt(row["Total Damage"]);
            let unmitigated_damage =
              parseInt(row["Total Damage"]) - parseInt(row["Mitigated Damage"]);
            let hull_damage = parseInt(row["Hull Damage"]);
            let round = parseInt(row["Round"]);
            if (!attackers.includes(target_name)) {
                stats_per_person[target_name] = {
                    total: 0,
                    unmitigated: 0,
                    hull: 0,
                    critical: 0,
                    total_recv: 0,
                    mitigated: 0,
                    hull_recv: 0    
                };    
            }
            if (!attackers.includes(attacker_name)) {
              attackers.push(attacker_name);
              stats_per_person[attacker_name] = {
                total: 0,
                unmitigated: 0,
                hull: 0,
                critical: 0,
                total_recv: 0,
                mitigated: 0,
                hull_recv: 0
              };
            }
            stats_per_person[attacker_name].total += total_damage;
            if(row["Critical Hit?"] == "YES") {
                stats_per_person[attacker_name].critical += total_damage;
            }
            if(target_name != "") {
                stats_per_person[target_name].mitigated += parseInt(row["Mitigated Damage"]);
                stats_per_person[target_name].hull_recv += hull_damage;
                stats_per_person[target_name].total_recv += total_damage;
            }
            stats_per_person[attacker_name].unmitigated += unmitigated_damage;
            stats_per_person[attacker_name].hull += hull_damage;
            if (stats_per_person_per_round.length < round) {
              stats_per_person_per_round.push({});
            }
            if (!stats_per_person_per_round[round - 1][attacker_name]) {
              stats_per_person_per_round[round - 1][attacker_name] = {
                total: 0,
                unmitigated: 0,
                hull: 0,
              };
            }
            stats_per_person_per_round[round - 1][attacker_name].total +=
              total_damage;
            stats_per_person_per_round[round - 1][attacker_name].unmitigated +=
              unmitigated_damage;
            stats_per_person_per_round[round - 1][attacker_name].hull +=
              hull_damage;
          }
        }
        for(let attacker in stats_per_person) {
            stats_per_person[attacker].critical_pct = (100.0 / parseFloat(stats_per_person[attacker].total) * parseFloat(stats_per_person[attacker].critical)).toFixed(2) + "%";
            stats_per_person[attacker].mitigated_pct = (100.0 / parseFloat(stats_per_person[attacker].total_recv) * parseFloat(stats_per_person[attacker].mitigated)).toFixed(2) + "%";
        }
        return {
            per_person: stats_per_person,
            per_round: stats_per_person_per_round,
            attackers: attackers,
            rounds: stats_per_person_per_round.length
        };
    }
}

export default BattleLog;
